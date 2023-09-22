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

const configRetriever = container.resolve<ConfigRetriever>("ConfigRetriever");
const codeParser = container.resolve<CodeParserAndWriter>(
  "CodeParserAndWriter"
);
const fileController = container.resolve<FileController>("FileController");
const vidocFactory = container.resolve<VidocFactory>("VidocFactory");
const ffmpeg = container.resolve<FFmpegInterface>("FFmpegInterface");
const cliScreenRecorder =
  container.resolve<CLIScreenRecorder>("CLIScreenRecorder");

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
  async (audioDevice: string) => await cliScreenRecorder.run(audioDevice),
  [
    {
      key: "audioDevice",
      required: true,
      description: "Audio Device ID",
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
  async (id: string) => await vidocFactory.initVidocObject(id),
  [
    {
      key: "id",
      required: true,
      description: "Vidoc ID (e.g. <uuid>.mp4)",
      type: "string",
    },
  ]
);

program.parse(process.argv);
