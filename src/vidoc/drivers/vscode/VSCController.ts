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
import { PositionedVidocInstance } from "../../model/Vidoc";
import { FileController } from "../../interfaces/FileController";
import { OSUtil } from "../general/screenRecording/screen-recorder/os";
import { FFmpegUtil } from "../general/screenRecording/screen-recorder/ffmpeg";
import { VSCHoverProvider } from "./VSCHoverProvider";
import { DefaultVidocPostprocessor } from "../general/DefaultVidocPostprocessor";
import { Notificator } from "../../interfaces/Notificator";

@singleton()
export class VSCController implements EditorController {
  statusBarItem?: vscode.StatusBarItem;
  currentHighlightings: PositionedVidocInstance[] = [];

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
    @inject("DefaultVidocPostprocessor")
    private vidocPostprocessor: DefaultVidocPostprocessor
  ) {}

  async getCurrentFocusInformation(): Promise<FocusInformation> {
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

  startIndicationOfRecording(): void {
    if (!this.statusBarItem) {
      return;
    }
    this.notificator.info("Starting recording...");
    this.statusBarItem.text = "Recording in progres... Click to Stop";
    this.statusBarItem.command = "vidoc.stopRecording";
    this.statusBarItem.color = "red";
    this.statusBarItem.show();
  }

  indicateRecordingSavingOrUploading(): void {
    if (!this.statusBarItem) {
      return;
    }
    this.notificator.info("Saving recording...");
    this.statusBarItem.text = "Saving / Uploading Recording...";
    this.statusBarItem.command = undefined;
    this.statusBarItem.color = "yellow";
    this.statusBarItem.show();
  }

  stopIndicationOfRecording(): void {
    if (!this.statusBarItem) {
      return;
    }
    this.statusBarItem.text = "Start recording";
    this.statusBarItem.command = "vidoc.startRecording";
    this.statusBarItem.color = "white";
    this.statusBarItem.show();
  }

  updateDecorationsByPositionedVidocs(editor: any) {
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

      ranges.push(new vscode.Range(line, startCharacter, line, endCharacter));

      // Apply new decorations
    }
    editor.setDecorations(decorationType, ranges);
  }

  async updateDecorations() {
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

  public activate(context: vscode.ExtensionContext): void {
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
        const focusInformation = await this.getCurrentFocusInformation();
        if (!focusInformation) {
          throw Error(
            "Recording only works if file is open in which we can input the resulting link"
          );
        }
        const vidocObject = await this.vidocFactory.createVidocObject(
          focusInformation
        );
        const textToAppend = await this.codeParserAndWriter.getStringToAppend(
          vidocObject
        );
        this.editorInteractor.insertStringAtEndOfLine(
          textToAppend,
          focusInformation.cursorPosition
        );
        await this.screenRecorder.startRecording(vidocObject);
        this.startIndicationOfRecording();
      }
    );

    /**
     * STOP RECORDING
     */
    let stopRecording = vscode.commands.registerTextEditorCommand(
      "vidoc.stopRecording",
      async () => {
        this.notificator.info("Stopping recording");
        this.indicateRecordingSavingOrUploading();
        try {
          const output = await this.screenRecorder.stopRecording();
          console.log({ output });
          await this.vidocPostprocessor.postprocessVidoc(output);
          console.log("Postprocessed recording");
          const anyOutput = <any>output;
          this.notificator.info(
            `Recording saved at ${
              anyOutput.relativeFilePath || anyOutput.remoteVideoUrl
            }`
          );
        } finally {
          this.stopIndicationOfRecording();
          this.updateDecorations();
        }
      }
    );

    /**
     * WIN-INFO COMMAND
     */
    let winInfoCmd = vscode.commands.registerCommand(
      "vidoc.wininfo",
      async () => {
        const opts = await FFmpegUtil.findFFmpegBinIfMissing({});
        const devices = await OSUtil.getWinDevices(opts.ffmpeg.binary, true);
        this.notificator.info(JSON.stringify(devices));
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

    // Listen for changes in the active text editor
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
        console.log("Updating decorations");
        this.updateDecorations();
      }
    });

    context.subscriptions.push(readConfig);
    context.subscriptions.push(startRecording);
    context.subscriptions.push(stopRecording);
    context.subscriptions.push(winInfoCmd);
    context.subscriptions.push(updateDecorations);
    this.registerRecalculationOfHighlightings(context);

    this.initStatusBarItem();
    this.updateDecorations();
  }

  registerRecalculationOfHighlightings(context: vscode.ExtensionContext) {
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

  deactivate() {
    if (this.screenRecorder.isRecording()) {
      this.screenRecorder.stopRecording();
    }
  }

  initStatusBarItem() {
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right
    );
    this.stopIndicationOfRecording();
  }
}
