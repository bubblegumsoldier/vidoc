import "./polyfills";

import { container } from "tsyringe";
import { ConfigRetriever } from "../vidoc/interfaces/ConfigRetriever";
import { GitConfigRetriever } from "../vidoc/drivers/general/config/GitConfigRetriever";
import { CLIFileController } from "../vidoc/drivers/cli/CLIFileController";
import { FileController } from "../vidoc/interfaces/FileController";
import { CodeParserAndWriter } from "../vidoc/interfaces/CodeParserAndWriter";
import { DefaultCodeParserAndWriter } from "../vidoc/drivers/general/DefaultCodeParserAndWriter";
import { VidocFactory } from "../vidoc/interfaces/VidocFactory";
import { DefaultVidocFactory } from "../vidoc/drivers/general/DefaultVidocFactory";
import { registerCommand } from "./registerCommand";
import { program } from "commander";
import { VidocIdGenerator } from "../vidoc/interfaces/VidocIdGenerator";
import { DefaultVidocIdGenerator } from "../vidoc/drivers/general/config/DeafultVidocIdGenerator";
import { DefaultFileUploadPathGuesser } from "../vidoc/drivers/general/file-upload/DefaultFileUploadPathGuesser";
import { FileUploadPathGuesser } from "../vidoc/interfaces/FileUploadPathGuesser";
import { CLIAuthorInformationRetriever } from "../vidoc/drivers/cli/CLIAuthorInformationRetriever";
import { AuthorInformationRetriever } from "../vidoc/interfaces/AuthorInformationRetriever";
import { RSScreenRecorder } from "../vidoc/drivers/general/screenRecording/RSScreenRecorder";
import { AudioDeviceSelector } from "../vidoc/interfaces/AudioDeviceSelector";
import { CLIAudioDeviceSelector } from "../vidoc/drivers/cli/dummy/CLIAudioDeviceSelector";
import { Notificator } from "../vidoc/interfaces/Notificator";
import { CLINotificator } from "../vidoc/drivers/cli/dummy/CLINotificator";
import { CLIScreenRecorder } from "../vidoc/drivers/cli/CLIScreenRecorder";
import { FFmpegInterface } from "../vidoc/interfaces/FFmpegInterface";
import { FFmpegImplementation } from "../vidoc/drivers/general/screenRecording/FFmpegImplementation";
import { DefaultVidocPostprocessor } from "../vidoc/drivers/general/DefaultVidocPostprocessor";
import { FileUploadPostprocessor } from "../vidoc/drivers/general/file-upload/FileUploadPostprocessor";
import { TmpToFilePostprocessor } from "../vidoc/drivers/general/file-upload/TmpToFilePostprocessor";
import { AWSRemoteVideoUploader } from "../vidoc/drivers/general/file-upload/AWSRemoteVideoUploader";
import { SpeechToTextPostprocessor } from "../vidoc/drivers/general/speech-to-text/SpeechToTextPostprocessor";
import { AWSTranscribeSpeechToText } from "../vidoc/drivers/general/speech-to-text/AWSTranscribeSpeechToText";
import { UnusedVidocRemover } from "../vidoc/interfaces/UnusedVidocRemover";
import { DefaultUnusedVidocRemover } from "../vidoc/drivers/general/DefaultUnusedVidocRemover";
import { VidocRepository } from "../vidoc/interfaces/VidocRepository";
import { DefaultVidocRepository } from "../vidoc/drivers/general/DefaultVidocRepository";
import { Prompter } from "../vidoc/interfaces/Prompter";
import { CLIPrompter } from "../vidoc/drivers/cli/CLIPrompter";
import { FocusInformation } from "../vidoc/model/FocusInformation";
import { HTMLPageGetter } from "../vidoc/interfaces/HTMLPageGetter";
import { DefaultHTMLPageGetter } from "../vidoc/drivers/general/DefaultHTMLPageGetter";
import { CLIHTMLPageWriter } from "../vidoc/drivers/cli/CLIHTMLPageWriter";
import { PageWriter } from "../vidoc/interfaces/PageWriter";
import { CommandExecutor } from "../vidoc/interfaces/CommandExecutor";
import { DefaultCommandExecutor } from "../vidoc/drivers/general/screenRecording/DefaultCommandExecutor";
import { WindowSelector } from "../vidoc/interfaces/WindowSelector";
import { ActiveWindowSelector } from "../vidoc/drivers/general/screenRecording/ActiveWindowSelector";
import { PreferencesManager } from "../vidoc/interfaces/PreferencesManager";
import { CLIPreferencesManager } from "../vidoc/drivers/cli/CLIPreferencesManager";
import { VidocCloudAccessor } from "../vidoc/interfaces/VidocCloudAccessor";
import { DefaultVidocCloudAccessor } from "../vidoc/drivers/general/DefaultVidocCloudAccessor";
import { TmpCleanup } from "../vidoc/drivers/general/TmpCleanup";
import { VideoMerger } from "../vidoc/drivers/general/VideoMerger";

container.register<ConfigRetriever>("ConfigRetriever", {
    useClass: GitConfigRetriever,
});
container.register<FileController>("FileController", {
    useClass: CLIFileController,
});
container.register<VidocFactory>("VidocFactory", {
    useClass: DefaultVidocFactory,
});
container.register<CodeParserAndWriter>("CodeParserAndWriter", {
    useClass: DefaultCodeParserAndWriter,
});
container.register<VidocIdGenerator>("VidocIdGenerator", {
    useClass: DefaultVidocIdGenerator,
});
container.register<FileUploadPathGuesser>("FileUploadPathGuesser", {
    useClass: DefaultFileUploadPathGuesser,
});
container.register<AuthorInformationRetriever>("AuthorInformationRetriever", {
    useClass: CLIAuthorInformationRetriever,
});
container.register<Notificator>("Notificator", {
    useClass: CLINotificator,
});
container.register<AuthorInformationRetriever>("AuthorInformationRetriever", {
    useClass: CLIAuthorInformationRetriever,
});
container.register<AudioDeviceSelector>("AudioDeviceSelector", {
    useClass: CLIAudioDeviceSelector,
});
container.register("RSScreenRecorder", RSScreenRecorder);
container.register("CLIScreenRecorder", CLIScreenRecorder);
container.register<FFmpegInterface>("FFmpegInterface", {
    useClass: FFmpegImplementation,
});
container.register<DefaultVidocPostprocessor>("DefaultVidocPostprocessor", {
    useClass: DefaultVidocPostprocessor,
});
container.register<FileUploadPostprocessor>("FileUploadPostprocessor", {
    useClass: FileUploadPostprocessor,
});
container.register<TmpToFilePostprocessor>("TmpToFilePostprocessor", {
    useClass: TmpToFilePostprocessor,
});
container.register<AWSRemoteVideoUploader>("AWSRemoteVideoUploader", {
    useClass: AWSRemoteVideoUploader,
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
container.register<VidocRepository>("VidocRepository", {
    useClass: DefaultVidocRepository,
});
container.register<Prompter>("Prompter", {
    useClass: CLIPrompter,
});
container.register<HTMLPageGetter>("HTMLPageGetter", {
    useClass: DefaultHTMLPageGetter,
});
container.register<PageWriter>("PageWriter", {
    useClass: CLIHTMLPageWriter,
});
container.register<CommandExecutor>("CommandExecutor", {
    useClass: DefaultCommandExecutor,
});
container.register<WindowSelector>("WindowSelector", {
    useClass: ActiveWindowSelector,
});
container.register<PreferencesManager>("PreferencesManager", {
    useClass: CLIPreferencesManager,
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

const configRetriever = container.resolve<ConfigRetriever>("ConfigRetriever");
const codeParser = container.resolve<CodeParserAndWriter>(
    "CodeParserAndWriter"
);
const fileController = container.resolve<FileController>("FileController");
const vidocFactory = container.resolve<VidocFactory>("VidocFactory");
const ffmpeg = container.resolve<FFmpegInterface>("FFmpegInterface");
const cliScreenRecorder =
    container.resolve<CLIScreenRecorder>("CLIScreenRecorder");
const defaultPostProcessor = container.resolve<DefaultVidocPostprocessor>(
    "DefaultVidocPostprocessor"
);
const unusedVidocRemover =
    container.resolve<UnusedVidocRemover>("UnusedVidocRemover");
const vidocRepository = container.resolve<VidocRepository>("VidocRepository");
const cliPageWriter = container.resolve<PageWriter>("PageWriter");
const vidocCloudAccessor =
    container.resolve<VidocCloudAccessor>("VidocCloudAccessor");
const preferencesManager =
    container.resolve<PreferencesManager>("PreferencesManager");

registerCommand(
    "getConfig",
    "Retrieve configuration",
    async () => await configRetriever.getConfig()
);

registerCommand(
    "parseFile",
    "Parse File for Vidoc Annotations",
    async (filePath: string) =>
        await codeParser.parseFileForVidoc(
            await fileController.readFileContent(filePath, true)
        ),
    [
        {
            key: "filePath",
            required: true,
            description: "Path to file to parse",
            type: "string",
        },
    ]
);

registerCommand(
    "record",
    "Start Recording. Press Ctrl + C to stop and trigger upload + postprocessing.",
    async (vidocId: string, audioDevice: string) =>
        await cliScreenRecorder.run(vidocId, audioDevice),
    [
        {
            key: "vidocId",
            required: true,
            description: "Vidoc ID",
            type: "string",
        },
        {
            key: "audioDevice",
            required: true,
            description: "Audio Device ID",
            type: "string",
        },
    ]
);

registerCommand(
    "ensureVidocCloudLogin",
    "Ensures that the token provided is valid. If not, it will open a browser window to log in and return an object { token: string | undefined } at the end.",
    async (vidocCloudToken?: string) => {
        await preferencesManager.setCurrentVidocCloudToken(vidocCloudToken);
        await vidocCloudAccessor.ensureLoggedIn();
        return {
            token: await preferencesManager.getCurrentVidocCloudToken(),
        };
    },
    [
        {
            key: "vidocCloudToken",
            required: false,
            description: "Current vidocCloudToken if available",
            type: "string",
            isBase64: true,
        },
    ]
);

registerCommand(
    "prepareVidoc",
    "Prepare a Vidoc before you will then record the MP4 for it. This will create the metadata file.",
    async (focusInformationJson: string, vidocCloudToken?: string) => {
        await preferencesManager.setCurrentVidocCloudToken(vidocCloudToken);
        await vidocFactory.create(JSON.parse(focusInformationJson));
    },
    [
        {
            key: "focusInformation",
            required: false,
            description: "JSON of the focusInformation",
            type: "string",
            isBase64: true,
        },
        {
            key: "vidocCloudToken",
            required: false,
            description: "Token for Vidoc Cloud API if existent",
            type: "string",
            isBase64: false,
        },
    ]
);

registerCommand(
    "getStringToAppend",
    "Get String to append to line in vidoc based on its metadata.",
    async (vidocId: string) =>
        await codeParser.getStringToAppend(await vidocFactory.init(vidocId)),
    [
        {
            key: "vidocId",
            required: true,
            description: "Vidoc ID",
            type: "string",
        },
    ]
);

registerCommand(
    "getAudioDevices",
    "List available audio devices",
    async () => await ffmpeg.getAudioDevices()
);

registerCommand(
    "getVidocObject",
    "Get Vidoc object for id (<uuid>.mp4)",
    async (id: string) => await vidocFactory.init(id),
    [
        {
            key: "id",
            required: true,
            description: "Vidoc ID (e.g. <uuid>.mp4)",
            type: "string",
        },
    ]
);

registerCommand(
    "postProcessVidoc",
    "Run the post processing chain for a freshly recorded Vidoc",
    async (vidocId: string, vidocCloudToken?: string) => {
        await preferencesManager.setCurrentVidocCloudToken(vidocCloudToken);
        return await defaultPostProcessor.postprocessVidoc(
            await vidocFactory.init(vidocId)
        );
    },
    [
        {
            key: "vidocId",
            required: true,
            description: "Vidoc ID (e.g. <uuid>.mp4)",
            type: "string",
        },
        {
            key: "vidocCloudToken",
            required: false,
            description: "Token for Vidoc Cloud API if existent",
            type: "string",
        },
    ]
);

registerCommand(
    "findUnusedFiles",
    "Find Files in the S3 Bucket that are not referenced in this repository.",
    async () =>
        await unusedVidocRemover.findUnusedFiles(
            (await vidocRepository.getAllVidocs()).map((v) => v.id)
        )
);

registerCommand(
    "removeUnusedFiles",
    "Find Files in the S3 Bucket that are not referenced in this repository and remove them.",
    async () => await unusedVidocRemover.removeUnusedVidocs()
);

registerCommand(
    "getVidocs",
    "List all vidocs including all metadata of the project",
    async () => await vidocRepository.getAllVidocs()
);

registerCommand(
    "writeVidocHTML",
    "Write out a vidoc HTML page to be viewed in the browser",
    async (vidocId: string) =>
        await cliPageWriter.writeHTMLPage(await vidocFactory.init(vidocId)),
    [
        {
            key: "vidocId",
            required: true,
            description: "Vidoc ID (e.g. <uuid>.mp4)",
            type: "string",
        },
    ]
);

program.parse(process.argv);
