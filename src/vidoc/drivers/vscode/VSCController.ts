import * as vscode from "vscode";
import { ConfigRetriever } from "../../interfaces/ConfigRetriever";
import { inject, singleton } from "tsyringe";
import { EditorController } from "../../interfaces/EditorController";
import { ScreenRecorder } from "../../interfaces/ScreenRecorder";
import {
    EditorSelection,
    FocusInformation,
} from "../../model/FocusInformation";
import { CodeParserAndWriter } from "../../interfaces/CodeParserAndWriter";
import { VidocFactory } from "../../interfaces/VidocFactory";
import { EditorInteractor } from "../../interfaces/EditorInteractor";
import {
    PositionedVidocInstance,
    Vidoc,
} from "../../model/Vidoc";
import { FileController } from "../../interfaces/FileController";
import { VSCHoverProvider } from "./VSCHoverProvider";
import { DefaultVidocPostprocessor } from "../general/DefaultVidocPostprocessor";
import { Notificator } from "../../interfaces/Notificator";
import { VideoOpener } from "../../interfaces/VideoOpener";
import { setExtensionPath } from "./global";
import path = require("path");
import { VSCVidocTreeProvider } from "./views/VSCVidocTreeProvider";
import { AudioDeviceSelector } from "../../interfaces/AudioDeviceSelector";
import { UnusedVidocRemover } from "../../interfaces/UnusedVidocRemover";

type VidocState =
    | "idle"
    | "waitingForStart"
    | "resuming"
    | "recording"
    | "postprocessing"
    | "paused"
    | "pausing";

type VSCVidocState = {
    currentVideoState: VidocState;
    currentVideo?: Vidoc;
};

type VSCStatusBarItems = {
    startRecording: vscode.StatusBarItem;
    stopRecording: vscode.StatusBarItem;
    pauseRecording: vscode.StatusBarItem;
    resumeRecording: vscode.StatusBarItem;
    statusInfo: vscode.StatusBarItem;
};

/** See Vidoc documentation for more context */
/* :vidoc 957baf1b-117e-4d5e-b706-4d4d8cf416aa.mp4 */
@singleton()
export class VSCController implements EditorController {
    statusBarItems?: VSCStatusBarItems;
    currentHighlightings: PositionedVidocInstance[] = [];
    private vidocTreeView: vscode.TreeView<vscode.TreeItem>;

    private state: VSCVidocState = {
        currentVideoState: "idle",
        currentVideo: undefined,
    };

    constructor(
        @inject("ConfigRetriever") private configRetriever: ConfigRetriever,
        @inject("ScreenRecorder") private screenRecorder: ScreenRecorder,
        @inject("FileController") private fileController: FileController,
        @inject("CodeParserAndWriter")
        private codeParserAndWriter: CodeParserAndWriter,
        @inject("VidocFactory") private vidocFactory: VidocFactory,
        @inject("EditorInteractor") private editorInteractor: EditorInteractor,
        @inject("VSCHoverProvider") private hoverProvider: VSCHoverProvider,
        @inject("Notificator") private notificator: Notificator,
        @inject("VideoOpener") private videoOpener: VideoOpener,
        @inject("VSCVidocTreeProvider")
        private vidocTreeProvider: VSCVidocTreeProvider,
        @inject("AudioDeviceSelector")
        private audioDeviceSelector: AudioDeviceSelector,
        @inject("DefaultVidocPostprocessor")
        private vidocPostprocessor: DefaultVidocPostprocessor,
        @inject("UnusedVidocRemover")
        private unusedVidocRemover: UnusedVidocRemover
    ) {
        this.vidocTreeView = vscode.window.createTreeView("vidocView", {
            treeDataProvider: this.vidocTreeProvider,
        });
    }

    public async getCurrentFocusInformation(): Promise<FocusInformation> {
        const activeTextEditor = vscode.window.activeTextEditor;
        if (!activeTextEditor) {
            return undefined;
        }
        const uri = activeTextEditor.document.uri;
        if (uri?.scheme !== "file") {
            return undefined;
        }
        const filePathRelative = uri.path;
        const selection: EditorSelection = {
            text: activeTextEditor.document.getText(activeTextEditor.selection),
            from: {
                lineIndex: activeTextEditor.selection.start.line,
                charIndex: activeTextEditor.selection.start.character,
                lineContent: activeTextEditor.document.lineAt(
                    activeTextEditor.selection.start.line
                ).text,
            },
            to: {
                lineIndex: activeTextEditor.selection.end.line,
                charIndex: activeTextEditor.selection.end.character,
                lineContent: activeTextEditor.document.lineAt(
                    activeTextEditor.selection.end.line
                ).text,
            },
        };
        return {
            currentSelection: selection,
            currentlyOpenedFileRelativeFilePath: filePathRelative,
            cursorPosition: {
                lineIndex: activeTextEditor.selection.active.line,
                charIndex: activeTextEditor.selection.active.character,
                lineContent: activeTextEditor.document.lineAt(
                    activeTextEditor.selection.active.line
                ).text,
            },
        };
    }

    public async updateIndicationBasedOnState() {
        if (!this.statusBarItems) {
            return;
        }
        if (this.state.currentVideoState === "idle") {
            // Show start recording button
            this.statusBarItems.startRecording.show();
            this.statusBarItems.stopRecording.hide();
            this.statusBarItems.pauseRecording.hide();
            this.statusBarItems.resumeRecording.hide();
        } else if (this.state.currentVideoState === "recording") {
            // Show stop recording button and pause recording button
            this.statusBarItems.startRecording.hide();
            this.statusBarItems.stopRecording.show();
            this.statusBarItems.pauseRecording.show();
            this.statusBarItems.resumeRecording.hide();
        } else if (this.state.currentVideoState === "postprocessing") {
            // Dont show any buttons
            this.statusBarItems.startRecording.hide();
            this.statusBarItems.stopRecording.hide();
            this.statusBarItems.pauseRecording.hide();
            this.statusBarItems.resumeRecording.hide();
        } else if (this.state.currentVideoState === "paused") {
            // Show stop recording button and resume recording button
            this.statusBarItems.startRecording.hide();
            this.statusBarItems.stopRecording.show();
            this.statusBarItems.pauseRecording.hide();
            this.statusBarItems.resumeRecording.show();
        }

        // Update status info text based on state
        const stateToText = {
            idle: "",
            waitingForStart: "Please wait...",
            recording: "Recording!",
            postprocessing: "Post Processing",
            paused: "Paused",
            pausing: "Pausing...",
            resuming: "Please wait..."
        };
        this.statusBarItems.statusInfo.text =
            stateToText[this.state.currentVideoState];
        // Set color to make sense
        const stateToColor = {
            idle: "white",
            waitingForStart: "yellow",
            recording: "red",
            postprocessing: "green",
            paused: "yellow",
            pausing: "yellow",
            resuming: "yellow"
        };
        this.statusBarItems.statusInfo.color =
            stateToColor[this.state.currentVideoState];
        this.statusBarItems.statusInfo.show();
    }

    private updateDecorationsByPositionedVidocs(editor: any) {
        // Clear existing decorations (if any)
        const decorationType = vscode.window.createTextEditorDecorationType({
            backgroundColor: "yellow",
            outlineColor: "white",
            outlineStyle: "dashed",
            outlineWidth: "1px",
            isWholeLine: false,
        });
        const ranges: vscode.Range[] = [];

        for (const vidoc of this.currentHighlightings) {
            const line = vidoc.range.from.lineIndex; // Specify the line number where you want to add the decoration
            const startCharacter = vidoc.range.from.charIndex; // Specify the starting character of the selection
            const endCharacter = vidoc.range.to.charIndex; // Specify the ending character of the selection

            ranges.push(
                new vscode.Range(line, startCharacter, line, endCharacter)
            );

            // Apply new decorations
        }
        editor.setDecorations(decorationType, ranges);
    }

    private async updateDecorations() {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        this.currentHighlightings =
            await this.codeParserAndWriter.parseFileForVidoc(
                editor.document.getText()
            );
        this.updateDecorationsByPositionedVidocs(editor);
    }

    private setState(state: VidocState) {
        this.state.currentVideoState = state;
        this.updateIndicationBasedOnState();
    }

    public activate(context: vscode.ExtensionContext): void {
        const extensionPath = path.join(context.extensionPath);
        setExtensionPath(extensionPath); // Store the path for use elsewhere

        /**
         * READ CONFIG
         */
        let readConfig = vscode.commands.registerCommand(
            "vidoc.readConfig",
            async () => {
                vscode.window.showInformationMessage(
                    JSON.stringify(await this.configRetriever.getConfig())
                );
            }
        );

        /**
         * START RECORDING
         */
        let startRecording = vscode.commands.registerCommand(
            "vidoc.startRecording",
            async () => {
                this.setState("waitingForStart");
                const focusInformation =
                    await this.getCurrentFocusInformation();
                if (!focusInformation) {
                    throw Error(
                        "Recording only works if file is open in which we can input the resulting link"
                    );
                }
                const vidocObject = await this.vidocFactory.create(
                    focusInformation
                );
                const textToAppend =
                    await this.codeParserAndWriter.getStringToAppend(
                        vidocObject
                    );
                this.editorInteractor.insertStringAtEndOfLine(
                    textToAppend,
                    focusInformation.cursorPosition
                );
                const newVidoc =
                    await this.screenRecorder.continueOrStartRecording(
                        vidocObject
                    );
                this.setState("recording");
                this.notificator.info("Started recording!");
                await this.vidocFactory.save(newVidoc);
                this.state.currentVideo = newVidoc;
            }
        );

        /**
         * RESUME RECORDING
         */
        let resumeRecording = vscode.commands.registerCommand(
            "vidoc.resumeRecording",
            async () => {
                this.setState("waitingForStart");
                if (!this.state.currentVideo) {
                    throw Error("No current video to resume recording for");
                }
                const newVidoc =
                    await this.screenRecorder.continueOrStartRecording(
                        this.state.currentVideo
                    );
                this.setState("recording");
                this.notificator.info("Resumed recording!");
                await this.vidocFactory.save(newVidoc);
                this.state.currentVideo = newVidoc;
            }
        );

        /**
         * PAUSE RECORDING
         */
        let pauseRecording = vscode.commands.registerCommand(
            "vidoc.pauseRecording",
            async () => {
                this.notificator.info("Stopping recording");
                this.setState("pausing");
                try {
                    const output = await this.screenRecorder.stopRecording();
                    await this.vidocFactory.save(output);
                    this.state.currentVideo = output;
                    console.log({ output });
                    this.notificator.info(`Recording paused`);
                } finally {
                    this.setState("paused");
                    this.updateDecorations();
                }
            }
        );

        /**
         * STOP RECORDING
         */
        let stopRecording = vscode.commands.registerTextEditorCommand(
            "vidoc.stopRecording",
            async () => {
                this.notificator.info("Postprocessing recording");
                this.setState("postprocessing");
                this.state.currentVideo = undefined;
                try {
                    const output = await this.screenRecorder.stopRecording();
                    await this.vidocFactory.save(output);
                    console.log({ output });
                    await this.vidocPostprocessor.postprocessVidoc(output);
                    console.log("Postprocessed recording");
                    const anyOutput = <any>output;
                    this.notificator.info(
                        `Recording saved at ${
                            anyOutput.relativeFilePath ||
                            anyOutput.remoteVideoUrl
                        }`
                    );
                } finally {
                    this.setState("idle");
                    this.updateDecorations();
                }
            }
        );

        let openVideo = vscode.commands.registerCommand(
            "vidoc.openVideo",
            async (vidocId: string) => {
                this.videoOpener.openVideoById(vidocId);
            }
        );

        /**
         * SELECT AUDIO DEVICE COMMAND
         */
        let selectAudioDevice = vscode.commands.registerCommand(
            "vidoc.selectAudioDevice",
            async () => {
                await this.audioDeviceSelector.forceReselectOfAudioDevice();
            }
        );

        /**
         * DECORATE SELECTION
         */
        let updateDecorations = vscode.commands.registerCommand(
            "vidoc.updateDecorations",
            () => {
                this.updateDecorations();
            }
        );

        let removeUnusedVidocs = vscode.commands.registerCommand(
            "vidoc.removeUnusedVidocs",
            async () => {
                await this.unusedVidocRemover.removeUnusedVidocs();
            }
        );

        // Listen for changes in the active text editor
        vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (editor) {
                console.log("Updating decorations");
                this.updateDecorations();
            }
        });

        context.subscriptions.push(readConfig);
        context.subscriptions.push(startRecording);
        context.subscriptions.push(pauseRecording);
        context.subscriptions.push(resumeRecording);
        context.subscriptions.push(stopRecording);
        context.subscriptions.push(removeUnusedVidocs);
        context.subscriptions.push(updateDecorations);
        context.subscriptions.push(openVideo);
        context.subscriptions.push(selectAudioDevice);

        this.registerRecalculationOfHighlightings(context);

        this.initStatusBarItems();
        this.updateDecorations();
    }

    private registerRecalculationOfHighlightings(context: vscode.ExtensionContext) {
        context.subscriptions.push(
            vscode.languages.registerHoverProvider("*", {
                provideHover: (document, position, token) => {
                    return this.hoverProvider.provideHover(
                        this.currentHighlightings,
                        document,
                        position,
                        token
                    );
                },
            })
        );
    }

    public deactivate() {
        if (this.screenRecorder.isRecording()) {
            this.screenRecorder.stopRecording();
        }
    }

    private initStatusBarItems() {
        this.statusBarItems = {
            startRecording: vscode.window.createStatusBarItem(
                vscode.StatusBarAlignment.Right,
                100
            ),
            stopRecording: vscode.window.createStatusBarItem(
                vscode.StatusBarAlignment.Right,
                100
            ),
            pauseRecording: vscode.window.createStatusBarItem(
                vscode.StatusBarAlignment.Right,
                100
            ),
            resumeRecording: vscode.window.createStatusBarItem(
                vscode.StatusBarAlignment.Right,
                100
            ),
            statusInfo: vscode.window.createStatusBarItem(
                vscode.StatusBarAlignment.Right,
                100
            ),
        };

        this.statusBarItems.startRecording.text = "Start recording";
        this.statusBarItems.startRecording.command = "vidoc.startRecording";
        this.statusBarItems.startRecording.color = "green";

        this.statusBarItems.stopRecording.text = "Stop recording";
        this.statusBarItems.stopRecording.command = "vidoc.stopRecording";
        this.statusBarItems.stopRecording.color = "red";

        this.statusBarItems.pauseRecording.text = "Pause recording";
        this.statusBarItems.pauseRecording.command = "vidoc.pauseRecording";
        this.statusBarItems.pauseRecording.color = "yellow";

        this.statusBarItems.resumeRecording.text = "Resume recording";
        this.statusBarItems.resumeRecording.command = "vidoc.resumeRecording";
        this.statusBarItems.resumeRecording.color = "green";
    }
}
