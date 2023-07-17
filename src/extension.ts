// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import "./polyfills";
import * as vscode from "vscode";

import { container } from "tsyringe";
import { VSCController } from "./vidoc/drivers/vscode/VSCController";
import { ConfigRetriever } from "./vidoc/interfaces/ConfigRetriever";
import { GitConfigRetriever } from "./vidoc/drivers/general/config/GitConfigRetriever";
import { FileController } from "./vidoc/interfaces/FileController";
import { VSCFileController } from "./vidoc/drivers/vscode/VSCFileController";
import { EditorController } from "./vidoc/interfaces/EditorController";
import { RSScreenRecorder } from "./vidoc/drivers/general/screenRecording/RSScreenRecorder";
import { VSCAuthorInformationRetriever } from "./vidoc/drivers/vscode/VSCAuthorInformationRetriever";
import { AuthorInformationRetriever } from "./vidoc/interfaces/AuthorInformationRetriever";
import { CodeParserAndWriter } from "./vidoc/interfaces/CodeParserAndWriter";
import { DefaultCodeParserAndWriter } from "./vidoc/drivers/general/DefaultCodeParserAndWriter";
import { EditorInteractor } from "./vidoc/interfaces/EditorInteractor";
import { VSCEditorInteractor } from "./vidoc/drivers/vscode/VSCEditorInteractor";
import { VidocFactory } from "./vidoc/interfaces/VidocFactory";
import { DefaultVidocFactory } from "./vidoc/drivers/general/DefaultVidocFactory";
import { VidocIdGenerator } from "./vidoc/interfaces/VidocIdGenerator";
import { DefaultVidocIdGenerator } from "./vidoc/drivers/general/config/DeafultVidocIdGenerator";
import { Prompter } from "./vidoc/interfaces/Prompter";
import { VSCPrompter } from "./vidoc/drivers/vscode/VSCPrompter";
import { VSCHoverProvider } from "./vidoc/drivers/vscode/VSCHoverProvider";

container.registerSingleton("VSCController", VSCController);
container.registerSingleton("ScreenRecorder", RSScreenRecorder);
container.register<ConfigRetriever>("ConfigRetriever", {
  useClass: GitConfigRetriever,
});
container.register<FileController>("FileController", {
  useClass: VSCFileController,
});
container.register<EditorController>("EditorController", {
  useClass: VSCController,
});
container.register<AuthorInformationRetriever>("AuthorInformationRetriever", {
  useClass: VSCAuthorInformationRetriever,
});
container.register<CodeParserAndWriter>("CodeParserAndWriter", {
  useClass: DefaultCodeParserAndWriter,
});
container.register<EditorInteractor>("EditorInteractor", {
  useClass: VSCEditorInteractor,
});
container.register<VidocFactory>("VidocFactory", {
  useClass: DefaultVidocFactory,
});
container.register<VidocIdGenerator>("VidocIdGenerator", {
  useClass: DefaultVidocIdGenerator,
});
container.register<Prompter>("Prompter", {
  useClass: VSCPrompter,
});
container.register<VSCHoverProvider>("VSCHoverProvider", {
  useClass: VSCHoverProvider,
});

const vscController = container.resolve<VSCController>("VSCController");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  vscController.activate(context);
}

// This method is called when your extension is deactivated
export function deactivate() {
  vscController.deactivate();
}
