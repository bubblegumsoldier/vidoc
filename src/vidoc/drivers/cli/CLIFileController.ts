import * as fs from "fs/promises";
import * as path from "path";
import { FileController } from "../../interfaces/FileController";
import { injectable } from "tsyringe";

@injectable()
export class CLIFileController implements FileController {
    async exists(file: string): Promise<boolean> {
        try {
            await fs.access(file);
            return true;
        } catch (error) {
            return false;
        }
    }

    async readFileContent(file: string, relative: boolean): Promise<string> {
        const filePath = relative ? path.resolve(process.cwd(), file) : file;
        return fs.readFile(filePath, "utf-8");
    }

    async readFileContentBinary(
        file: string,
        relative: boolean
    ): Promise<Uint8Array> {
        const filePath = relative ? path.resolve(process.cwd(), file) : file;
        return fs.readFile(filePath);
    }

    async writeFileContent(
        filePath: string,
        content: string,
        relative: boolean
    ): Promise<void> {
        const resolvedPath = relative
            ? path.resolve(process.cwd(), filePath)
            : filePath;
        console.log(`Writing file ${resolvedPath}`);
        console.log(`Content ${content}`);
        await fs.writeFile(resolvedPath, content, "utf-8");
        if ((await fs.readFile(resolvedPath, "utf-8")) !== content) {
            throw Error("Writing content did not really work");
        }
    }

    getAbsolutePath(relativePath: string): string {
        return path.resolve(process.cwd(), relativePath);
    }

    async createDirIfNotExists(absoluteFolderPath: string): Promise<void> {
        try {
            await fs.access(absoluteFolderPath);
        } catch (error) {
            await fs.mkdir(absoluteFolderPath, { recursive: true });
        }
    }

    async copyFile(
        sourceFilePath: string,
        targetFilePath: string,
        relative: boolean
    ): Promise<void> {
        const resolvedSource = relative
            ? path.resolve(process.cwd(), sourceFilePath)
            : sourceFilePath;
        const resolvedTarget = relative
            ? path.resolve(process.cwd(), targetFilePath)
            : targetFilePath;
        await fs.copyFile(resolvedSource, resolvedTarget);
    }

    async moveFile(
        sourceFilePath: string,
        targetFilePath: string,
        relative: boolean
    ): Promise<void> {
        const resolvedSource = relative
            ? path.resolve(process.cwd(), sourceFilePath)
            : sourceFilePath;
        const resolvedTarget = relative
            ? path.resolve(process.cwd(), targetFilePath)
            : targetFilePath;
        await fs.rename(resolvedSource, resolvedTarget);
    }

    async deleteFile(filePath: string, relative: boolean): Promise<void> {
        const resolvedPath = relative
            ? path.resolve(process.cwd(), filePath)
            : filePath;
        await fs.unlink(resolvedPath);
    }

    private getTmpFolder(): string {
        return path.join(process.cwd(), ".vidoc", "tmp");
    }

    async generateTmpFilePath(id: string): Promise<string> {
        const tmpDir = this.getTmpFolder();

        // Ensure the tmp directory exists
        if (
            !(await fs
                .access(tmpDir)
                .then(() => true)
                .catch(() => false))
        ) {
            await fs.mkdir(tmpDir, { recursive: true });
        }

        let filePath = path.join(tmpDir, id);
        let counter = 0;

        // Check if the file exists and append a counter if it does
        while (
            await fs
                .access(filePath + (counter ? `-${counter}` : ""))
                .then(() => true)
                .catch(() => false)
        ) {
            counter++;
        }

        // Append the counter to the file path if necessary
        return counter ? `${filePath}-${counter}` : filePath;
    }

    public async cleanupTmp(): Promise<void> {
        const absoluteTmpFolder = this.getTmpFolder();
        await fs.rm(absoluteTmpFolder, { recursive: true });
    }

    async getBinPath(binName: string): Promise<string> {
        // Assumes this exe to be under /dist/cli/bin/vidoc-win.exe or vidoc-macos
        // Assumes the ffmpeg binaries to be under /dist/cli/bin/ffmpeg-win.exe or ffmpet-darwin.exe
        let binPath = path.join(path.dirname(process.execPath), `${binName}`);
        if (!(<any>process).pkg) {
            binPath = path.join(__dirname, "bin", `${binName}`);
        }
        if (await this.exists(binPath)) {
            return binPath;
        } else {
            throw new Error(`Binary ${binName} does not exist at ${binPath}`);
        }
    }

    async getAllFilesInFolder(
        folderPath: string,
        relative: boolean
    ): Promise<string[]> {
        const resolvedPath = relative
            ? path.resolve(process.cwd(), folderPath)
            : folderPath;
        const dirents = await fs.readdir(resolvedPath, { withFileTypes: true });
        return dirents
            .filter((dirent) => dirent.isFile())
            .map((dirent) => dirent.name);
    }
}
