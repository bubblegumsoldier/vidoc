import * as vscode from "vscode";
import { ConfigRetriever } from "../../interfaces/ConfigRetriever";
import { inject, singleton } from "tsyringe";
import { EditorController } from "../../interfaces/EditorController";
import { ScreenRecorder } from "../../interfaces/ScreenRecorder";
import * as winInfo from "@arcsine/win-info";
import {
  EditorSelection,
  FocusInformation,
} from "../../model/FocusInformation";
import { CodeParserAndWriter } from "../../interfaces/CodeParserAndWriter";
import { VidocFactory } from "../../interfaces/VidocFactory";
import { EditorInteractor } from "../../interfaces/EditorInteractor";

@singleton()
export class VSCController implements EditorController {
  statusBarItem?: vscode.StatusBarItem;
  constructor(
    @inject("ConfigRetriever") private configRetriever: ConfigRetriever,
    @inject("ScreenRecorder") private screenRecorder: ScreenRecorder,
    @inject("CodeParserAndWriter")
    private codeParserAndWriter: CodeParserAndWriter,
    @inject("VidocFactory") private vidocFactory: VidocFactory,
    @inject("EditorInteractor") private editorInteractor: EditorInteractor,
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

  notify(s: string): void {
    vscode.window.showInformationMessage(s);
  }

  startIndicationOfRecording(): void {
    if (!this.statusBarItem) {
      return;
    }
    this.notify("Starting recording...");
    this.statusBarItem.text = "Recording in progres... Click to Stop";
    this.statusBarItem.command = "vidoc.stopRecording";
    this.statusBarItem.color = "red";
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

  public activate(context: vscode.ExtensionContext): void {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vidoc" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand("vidoc.helloWorld", () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World from vidoc!");
    });
    let readConfig = vscode.commands.registerCommand(
      "vidoc.readConfig",
      async () => {
        vscode.window.showInformationMessage(
          JSON.stringify(await this.configRetriever.getConfig())
        );
      }
    );
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
        await this.screenRecorder.startRecording(
          vidocObject
        );
        this.startIndicationOfRecording();
      }
    );
    let stopRecording = vscode.commands.registerTextEditorCommand(
      "vidoc.stopRecording",
      async () => {
        this.notify("Stopping recording");
        const output = await this.screenRecorder.stopRecording();
        this.notify(`Recording saved under ${output}`);
        this.stopIndicationOfRecording();
      }
    );
    let winInfoCmd = vscode.commands.registerCommand(
      "vidoc.wininfo",
      async () => {
        this.notify(JSON.stringify(await winInfo.getActive()));
      }
    );
    context.subscriptions.push(disposable);
    context.subscriptions.push(readConfig);
    context.subscriptions.push(startRecording);
    context.subscriptions.push(stopRecording);
    context.subscriptions.push(winInfoCmd);

    this.initStatusBarItem();
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
