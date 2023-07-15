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
import { OutputFilePathGenerator } from "./vidoc/interfaces/OutputFilePathGenerator";
import { DefaultOutputFilePathGenerator } from "./vidoc/drivers/general/config/DefaultOutputFilePathGenerator";
import { RSScreenRecorder } from "./vidoc/drivers/general/screenRecording/RSScreenRecorder";

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
container.register<OutputFilePathGenerator>("OutputFilePathGenerator", {
	useClass: DefaultOutputFilePathGenerator,
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
