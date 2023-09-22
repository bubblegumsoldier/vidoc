import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";
import { FileController } from "../../interfaces/FileController";
import { injectable } from "tsyringe";

async function printFolderTree(startPath: string, level = 0) {
  // Get the list of files and directories in the startPath
  let filesAndDirectories;
  try {
    filesAndDirectories = await fs.readdir(startPath);
  } catch (err) {
    console.error(`Error reading directory ${startPath}:`, err);
    return;
  }

  // Loop through the list and print files and directories
  for (const name of filesAndDirectories) {
    const fullPath = path.join(startPath, name);
    const stats = await fs.stat(fullPath);

    // Print the current item with indentation
    console.log(fullPath);

    // If the item is a directory, recurse into it
    if (stats.isDirectory()) {
      printFolderTree(fullPath, level + 1);
    }
  }
}

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
    await fs.writeFile(resolvedPath, content, "utf-8");
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

  async generateTmpFilePath(id: string): Promise<string> {
    const tmpDir = os.tmpdir();
    const tmpFilePath = path.join(tmpDir, id);
    return tmpFilePath;
  }

  async getBinPath(binName: string): Promise<string> {
    // Assumes this exe to be under /dist/cli/bin/vidoc-win.exe or vidoc-macos
    // Assumes the ffmpeg binaries to be under /dist/cli/bin/ffmpeg-win.exe or ffmpet-darwin.exe
    let binPath = path.join(path.dirname(process.execPath), `${binName}`);
    if(!(<any>process).pkg) {
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
