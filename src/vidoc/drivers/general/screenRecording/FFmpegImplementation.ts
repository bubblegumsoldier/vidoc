import { inject, injectable } from "tsyringe";
import { FFmpegInterface } from "../../../interfaces/FFmpegInterface";
import { Notificator } from "../../../interfaces/Notificator";
import { FileController } from "../../../interfaces/FileController";

import {
    CommandExecutionReference,
    CommandExecutor,
} from "../../../interfaces/CommandExecutor";
import { WinInfoWindowInformation } from "./ActiveWindowSelector";
import * as path from "path";
import * as fs from "fs/promises";
import { RecordingAreaInformation } from "../../../model/Vidoc";
@injectable()
export class FFmpegImplementation implements FFmpegInterface {
    constructor(
        @inject("FileController") private fileController: FileController,
        @inject("Notificator") private notificator: Notificator,
        @inject("CommandExecutor") private commandExecutor: CommandExecutor
    ) {}

    private async getWin32Args(
        audioDevice: string,
        recordingAreaInformation: RecordingAreaInformation,
        fps: number
    ): Promise<string[]> {
        return [
            "-f",
            "dshow", // Specifies the input format to be DirectShow.
            "-i",
            'audio="' + audioDevice + '"', // Specifies the audio input device.
            "-threads",
            "4", // Specifies the number of threads to use for encoding.

            // Video
            "-r",
            fps.toString(), // Specifies the frame rate of the output video.
            "-video_size",
            `${recordingAreaInformation.bounds.width}x${recordingAreaInformation.bounds.height}`, // Specifies the video size of the output video.
            "-offset_x",
            `${recordingAreaInformation.bounds.x}`, // Specifies the offset on the X axis of the window to be recorded.
            "-offset_y",
            `${recordingAreaInformation.bounds.y}`, // Specifies the offset on the Y axis of the window to be recorded.
            "-f",
            "gdigrab", // Specifies the input format to be GDI Grab.
            "-i",
            "desktop", // Specifies the desktop as the video input device.
            "-preset",
            "ultrafast", // Specifies a very fast encoding preset.

            // Output
            "-crf",
            "23", // Specifies the constant rate factor (CRF) for video encoding. A lower CRF value will result in higher quality video, but also a larger file size.
            "-pix_fmt",
            "yuv420p", // Specifies the pixel format of the output video.
            "-c:v",
            "h264", // Specifies the video codec to use for encoding. H.264 is a widely supported codec that produces good quality video at a relatively small file size.
            "-y", // Overwrites the output file without prompting.
            "-b:a",
            "127k", // Specifies the bitrate for audio encoding. A higher bitrate will result in higher quality audio, but also a larger file size.
            "-c:a",
            "libmp3lame", // Specifies the audio codec to use for encoding. MP3 is a widely supported codec that produces good quality audio at a relatively small file size.
            "-ac",
            "1", // Specifies the number of audio channels to encode.
        ];
    }

    private async getDarwinVideoDevice(
        screenId: number
    ): Promise<string | undefined> {
        const matchingScreen = await this.commandExecutor.executeProcess(
            await this.getPathToFFmpegBinary(),
            ["-f", "avfoundation", "-list_devices", "true", "-i", '""']
        );
        const output = matchingScreen.stderr || "" + matchingScreen.stdout;
        console.log(output);
        const regex = new RegExp(`\\[([0-9]+)\\] Capture screen ${screenId}`);
        const match = output.match(regex);
        console.log({ match });
        return match ? parseInt(match[1], 10).toString() : undefined;
    }

    private async getDarwinArgs(
        audioDevice: string,
        recordingAreaInformation: RecordingAreaInformation,
        fps: number
    ): Promise<any> {
        if (!recordingAreaInformation.screen) {
            throw Error("Couldn't find any screens");
        }

        // assuming the first screen is the one we want to capture.
        const screen = recordingAreaInformation.screen;
        const screenIndexFFMPEG = await this.getDarwinVideoDevice(screen.index);

        if (!screenIndexFFMPEG) {
            throw Error("Did not find correct screen to record");
        }

        // Forming the scaling and cropping filter string
        const filterString = `scale=${screen.width}:${
            screen.height
        }:flags=lanczos,crop=${recordingAreaInformation.bounds.width}:${
            recordingAreaInformation.bounds.height
        }:${Math.abs(screen.x - recordingAreaInformation.bounds.x)}:${Math.abs(
            screen.y - recordingAreaInformation.bounds.y
        )}`;

        return [
            "-f",
            "avfoundation", // Specifies the input format to be avfoundation for macOS.
            "-framerate",
            "30", // Specifies the frame rate of the output video.
            "-i",
            `${screenIndexFFMPEG}:"${audioDevice}"`, // Specifies the video and audio input devices.

            // Video Filter (Scaling and Cropping)
            "-vf",
            filterString,

            // Specify more encoding options
            "-r", // Frame rate of the output file
            fps.toString(),
            "-c:v",
            "libx264", // Specifies the video codec to use for encoding.
            "-preset",
            "ultrafast", // Specifies a very fast encoding preset.
            "-crf",
            "23", // Specifies the constant rate factor (CRF) for video encoding.
            "-pix_fmt",
            "yuv420p", // Specifies the pixel format of the output video.

            // Audio Encoding options
            "-b:a",
            "128k", // Specifies the bitrate for audio encoding.
            "-c:a",
            "libmp3lame", // Specifies the audio codec to use for encoding.
            "-ac",
            "2", // Specifies the number of audio channels to encode.

            "-y", // Overwrites the output file without prompting.
        ];
    }

    async record(
        recordingAreaInformation: RecordingAreaInformation,
        audioDevice: string,
        outputFile: string,
        fps: number
    ): Promise<CommandExecutionReference> {
        if (!recordingAreaInformation.bounds) {
            throw Error("Invalid window was received");
        }
        let args: string[];
        switch (process.platform) {
            case "win32":
                args = await this.getWin32Args(
                    audioDevice,
                    recordingAreaInformation,
                    fps
                );
                break;
            case "darwin":
                args = await this.getDarwinArgs(
                    audioDevice,
                    recordingAreaInformation,
                    fps
                );
                break;
            default:
                throw new Error(`Unsupported platform: ${process.platform}`);
        }
        const formattedOutputFile = outputFile.includes(" ")
            ? `"${outputFile}"`
            : outputFile;
        const processReturnValue = await this.commandExecutor.processToPromise(
            await this.getPathToFFmpegBinary(),
            [...args, formattedOutputFile]
        );
        return {
            finish: processReturnValue.finish,
            kill: (_?: boolean) => {
                processReturnValue.proc.stdin!.write("q");
            },
            proc: processReturnValue.proc,
        };
    }

    async getAudioDevices(): Promise<string[]> {
        if (process.platform === "win32") {
            return await this.getWinAudioDevices();
        } else if (process.platform === "darwin") {
            return await this.getMacAudioDevices();
        } else {
            throw Error("Unsupported platform Linux");
        }
    }

    async getMacAudioDevices(): Promise<string[]> {
        let text;
        try {
            // Use 'avfoundation' for macOS instead of 'dshow' for Windows
            const { stderr } = await this.commandExecutor.executeProcess(
                await this.getPathToFFmpegBinary(),
                ["-f", "avfoundation", "-list_devices", "true", "-i", '""']
            );
            text = stderr;
        } catch (e) {
            throw e;
        }
        console.log(text);
        const audioDevicesOnlyText = text?.split("audio devices")[1];

        // Adjust the regular expression to match the macOS output
        const regex = /\[AVFoundation [a-zA-Z\s]+ @ [\w]+\]\s\[(\d+)\]\s(.+)?/g;

        const textLines = audioDevicesOnlyText?.split("\n") || [];
        const foundDevices: string[] = [];

        let match;
        for (const line of textLines) {
            while ((match = regex.exec(line)) !== null) {
                const matchingGroup = match[2]; // Group 2 captures the actual device name
                foundDevices.push(matchingGroup);
            }
        }

        return foundDevices;
    }

    async getWinAudioDevices(): Promise<string[]> {
        let text;
        try {
            const { stderr } = await this.commandExecutor.executeProcess(
                await this.getPathToFFmpegBinary(),
                ["-f", "dshow", "-list_devices", "true", "-i", "dummy"]
            );
            text = stderr;
        } catch (e) {
            throw e;
        }
        console.log(text);
        const regex = /\"(.+)\"\s\(audio\)/g;
        const textLines = text?.split("\n") || [];

        let match;
        const foundDevices = [];
        for (const line of textLines) {
            while ((match = regex.exec(line)) !== null) {
                const matchingGroup = match[1]; // Group 1 captures the actual device name
                const start = match.index;
                const end = start + match[0].length;
                foundDevices.push(matchingGroup);
            }
        }
        return foundDevices;
    }

    private async findFFmpegOnPath(): Promise<string | undefined> {
        return await this.findFileOnPath(
            process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg"
        );
    }

    async findFileOnPath(
        name: string,
        extra: string[] = []
    ): Promise<string | undefined> {
        const paths = (process.env.PATH || "")
            .split(path.delimiter)
            .map((x) => path.resolve(x, name));

        paths.unshift(...extra);

        for (const p of paths) {
            try {
                await fs.access(p);
                return p;
            } catch (error) {
                continue;
            }
        }
        return undefined;
    }

    async getPathToFFmpegBinary(): Promise<string> {
        let pathToFFmpegBinary: string | undefined =
            await this.fileController.getBinPath(
                process.platform === "win32"
                    ? "ffmpeg-win32.exe"
                    : "ffmpeg-darwin"
            );
        if (!this.fileController.exists(pathToFFmpegBinary)) {
            this.notificator.warn(
                "We didn't find an ffmpeg for your system. We will look on the PATH for it."
            );
            pathToFFmpegBinary = undefined; // it will be looked for on the PATH (this will be necessary for linux)
        }
        console.log({ pathToFFmpegBinary });
        if (!pathToFFmpegBinary) {
            pathToFFmpegBinary = await this.findFFmpegOnPath();
        }
        if (!pathToFFmpegBinary) {
            throw Error("No path found, neither in extension nor on PATH");
        }
        return pathToFFmpegBinary;
    }
}
