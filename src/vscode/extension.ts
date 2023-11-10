// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import "./polyfills";
import * as vscode from "vscode";

import { container } from "tsyringe";
import { VSCController } from "../vidoc/drivers/vscode/VSCController";
import { ConfigRetriever } from "../vidoc/interfaces/ConfigRetriever";
import { GitConfigRetriever } from "../vidoc/drivers/general/config/GitConfigRetriever";
import { FileController } from "../vidoc/interfaces/FileController";
import { VSCFileController } from "../vidoc/drivers/vscode/VSCFileController";
import { EditorController } from "../vidoc/interfaces/EditorController";
import { RSScreenRecorder } from "../vidoc/drivers/general/screenRecording/RSScreenRecorder";
import { VSCAuthorInformationRetriever } from "../vidoc/drivers/vscode/VSCAuthorInformationRetriever";
import { AuthorInformationRetriever } from "../vidoc/interfaces/AuthorInformationRetriever";
import { CodeParserAndWriter } from "../vidoc/interfaces/CodeParserAndWriter";
import { DefaultCodeParserAndWriter } from "../vidoc/drivers/general/DefaultCodeParserAndWriter";
import { EditorInteractor } from "../vidoc/interfaces/EditorInteractor";
import { VSCEditorInteractor } from "../vidoc/drivers/vscode/VSCEditorInteractor";
import { VidocFactory } from "../vidoc/interfaces/VidocFactory";
import { DefaultVidocFactory } from "../vidoc/drivers/general/DefaultVidocFactory";
import { VidocIdGenerator } from "../vidoc/interfaces/VidocIdGenerator";
import { DefaultVidocIdGenerator } from "../vidoc/drivers/general/config/DeafultVidocIdGenerator";
import { Prompter } from "../vidoc/interfaces/Prompter";
import { VSCPrompter } from "../vidoc/drivers/vscode/VSCPrompter";
import { VSCHoverProvider } from "../vidoc/drivers/vscode/VSCHoverProvider";
import { DefaultVidocPostprocessor } from "../vidoc/drivers/general/DefaultVidocPostprocessor";
import { FileUploadPostprocessor } from "../vidoc/drivers/general/file-upload/FileUploadPostprocessor";
import { TmpToFilePostprocessor } from "../vidoc/drivers/general/file-upload/TmpToFilePostprocessor";
import { AWSRemoteVideoUploader } from "../vidoc/drivers/general/file-upload/AWSRemoteVideoUploader";
import { Notificator } from "../vidoc/interfaces/Notificator";
import { VSCNotificator } from "../vidoc/drivers/vscode/VSCNotificator";
import { FileUploadPathGuesser } from "../vidoc/interfaces/FileUploadPathGuesser";
import { DefaultFileUploadPathGuesser } from "../vidoc/drivers/general/file-upload/DefaultFileUploadPathGuesser";
import { VideoOpener } from "../vidoc/interfaces/VideoOpener";
import { VSCVideoOpener } from "../vidoc/drivers/vscode/VSCVideoOpener";
import { DefaultVidocRepository } from "../vidoc/drivers/general/DefaultVidocRepository";
import { VidocRepository } from "../vidoc/interfaces/VidocRepository";
import { VSCVidocTreeProvider } from "../vidoc/drivers/vscode/views/VSCVidocTreeProvider";
import { PreferencesManager } from "../vidoc/interfaces/PreferencesManager";
import { VSCPreferencesManager } from "../vidoc/drivers/vscode/VSCPreferencesManager";
import { VSCAudioDeviceSelector } from "../vidoc/drivers/vscode/VSCAudioDeviceSelector";
import { AudioDeviceSelector } from "../vidoc/interfaces/AudioDeviceSelector";
import { FFmpegImplementation } from "../vidoc/drivers/general/screenRecording/FFmpegImplementation";
import { FFmpegInterface } from "../vidoc/interfaces/FFmpegInterface";
import { SpeechToTextPostprocessor } from "../vidoc/drivers/general/speech-to-text/SpeechToTextPostprocessor";
import { AWSTranscribeSpeechToText } from "../vidoc/drivers/general/speech-to-text/AWSTranscribeSpeechToText";
import { DefaultUnusedVidocRemover } from "../vidoc/drivers/general/DefaultUnusedVidocRemover";
import { UnusedVidocRemover } from "../vidoc/interfaces/UnusedVidocRemover";
import { DefaultHTMLPageGetter } from "../vidoc/drivers/general/DefaultHTMLPageGetter";
import { HTMLPageGetter } from "../vidoc/interfaces/HTMLPageGetter";
import { DefaultCommandExecutor } from "../vidoc/drivers/general/screenRecording/DefaultCommandExecutor";
import { CommandExecutor } from "../vidoc/interfaces/CommandExecutor";
import { WindowSelector } from "../vidoc/interfaces/WindowSelector";
import { ActiveWindowSelector } from "../vidoc/drivers/general/screenRecording/ActiveWindowSelector";
import { VidocCloudAccessor } from "../vidoc/interfaces/VidocCloudAccessor";
import { DefaultVidocCloudAccessor } from "../vidoc/drivers/general/DefaultVidocCloudAccessor";
import { VidocCloudVideoUploader } from "../vidoc/drivers/general/file-upload/VidocCloudVideoUploader";
import { VidocCloudUploadUrlRemover } from "../vidoc/drivers/general/file-upload/VidocCloudUploadUrlRemover";
import { TmpCleanup } from "../vidoc/drivers/general/TmpCleanup";
import { VideoMerger } from "../vidoc/drivers/general/VideoMerger";

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
container.register<Notificator>("Notificator", {
    useClass: VSCNotificator,
});
container.register<VSCHoverProvider>("VSCHoverProvider", {
    useClass: VSCHoverProvider,
});
container.register<DefaultVidocPostprocessor>("DefaultVidocPostprocessor", {
    useClass: DefaultVidocPostprocessor,
});
container.register<FileUploadPostprocessor>("FileUploadPostprocessor", {
    useClass: FileUploadPostprocessor,
});
container.register<VidocCloudVideoUploader>("VidocCloudVideoUploader", {
    useClass: VidocCloudVideoUploader,
});
container.register<VidocCloudUploadUrlRemover>("VidocCloudUploadUrlRemover", {
    useClass: VidocCloudUploadUrlRemover,
});
container.register<TmpToFilePostprocessor>("TmpToFilePostprocessor", {
    useClass: TmpToFilePostprocessor,
});
container.register<AWSRemoteVideoUploader>("AWSRemoteVideoUploader", {
    useClass: AWSRemoteVideoUploader,
});
container.register<FileUploadPathGuesser>("FileUploadPathGuesser", {
    useClass: DefaultFileUploadPathGuesser,
});
container.register<VideoOpener>("VideoOpener", {
    useClass: VSCVideoOpener,
});
container.register<VidocRepository>("VidocRepository", {
    useClass: DefaultVidocRepository,
});
container.register<VSCVidocTreeProvider>("VSCVidocTreeProvider", {
    useClass: VSCVidocTreeProvider,
});
container.register<PreferencesManager>("PreferencesManager", {
    useClass: VSCPreferencesManager,
});
container.register<AudioDeviceSelector>("AudioDeviceSelector", {
    useClass: VSCAudioDeviceSelector,
});
container.register<FFmpegInterface>("FFmpegInterface", {
    useClass: FFmpegImplementation,
});
container.register<SpeechToTextPostprocessor>("SpeechToTextPostprocessor", {
    useClass: SpeechToTextPostprocessor,
});
container.register<AWSTranscribeSpeechToText>("AWSTranscribeSpeechToText", {
    useClass: AWSTranscribeSpeechToText,
});
container.register<UnusedVidocRemover>("UnusedVidocRemover", {
    useClass: DefaultUnusedVidocRemover,
});
container.register<HTMLPageGetter>("HTMLPageGetter", {
    useClass: DefaultHTMLPageGetter,
});
container.register<CommandExecutor>("CommandExecutor", {
    useClass: DefaultCommandExecutor,
});
container.register<WindowSelector>("WindowSelector", {
    useClass: ActiveWindowSelector,
});
container.register<VidocCloudAccessor>("VidocCloudAccessor", {
    useClass: DefaultVidocCloudAccessor,
});
container.register<TmpCleanup>("TmpCleanup", {
    useClass: TmpCleanup,
});
container.register<VideoMerger>("VideoMerger", {
    useClass: VideoMerger,
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
