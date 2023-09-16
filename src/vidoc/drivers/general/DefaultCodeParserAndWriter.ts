import { inject, injectable } from "tsyringe";
import { CodeParserAndWriter } from "../../interfaces/CodeParserAndWriter";
import { PositionedVidocInstance, Vidoc } from "../../model/Vidoc";
import { VidocFactory } from "../../interfaces/VidocFactory";

const REGEX = /:vidoc\s([a-zA-Z0-9-]+\.[a-zA-Z0-9]+)/g;

interface FileEndingToStringCallback {
  allowedFileEndings: string[];
  callback: (text: string, lineContent: string) => string;
}

const FILE_SUFFIX_ENDING_MAPPING: FileEndingToStringCallback[] = [
  {
    allowedFileEndings: ["py", "pyx"],
    callback: (text: string, lineContent: string) => {
      if (text.indexOf("#") >= 0) {
        return text;
      }
      return `# ${text}`;
    },
  },
  {
    allowedFileEndings: ["html", "xml"],
    callback: (text: string, lineContent: string) => {
      return `<!-- ${text} -->`;
    },
  },
  {
    allowedFileEndings: ["js", "ts"],
    callback: (text: string, lineContent: string) => {
      return `// ${text}`;
    },
  },
];

@injectable()
export class DefaultCodeParserAndWriter implements CodeParserAndWriter {
  constructor(@inject("VidocFactory") private vidocFactory: VidocFactory) {}

  getStringForRecordedVidoc(vidocId: string): string {
    return `:vidoc ${vidocId}`;
  }

  /**
   * Will definetly have to redo this API... it's quite shitty
   * @param focusInformation
   * @param vidocId
   * @returns
   */
  getStringToAppend(vidoc: Vidoc): string {
    let text = this.getStringForRecordedVidoc(vidoc.id);
    for (const fileType of FILE_SUFFIX_ENDING_MAPPING) {
      const hasMapping =
        fileType.allowedFileEndings.filter((suffix) =>
          vidoc.metadata.focusInformation?.currentlyOpenedFileRelativeFilePath.endsWith(
            `.${suffix}`
          )
        ).length > 0;
      if (!hasMapping) {
        continue;
      }
      text = fileType.callback(
        text,
        vidoc.metadata.focusInformation?.cursorPosition.lineContent || ""
      );
      break;
    }
    return text;
  }

  async parseLineForVidoc(
    lineContent: string,
    lineNumber: number
  ): Promise<PositionedVidocInstance[]> {
    if (lineContent.indexOf(":vidoc") < 0) {
      return [];
    }
    let foundIds: { id: string; start: number; end: number }[] = []; // Array to store the matched IDs with their indices
    let match;
    const regex = /:vidoc\s([a-zA-Z0-9-]+\.[a-zA-Z0-9]+)/g; // Replace "your_regex" with your desired regular expression pattern

    while ((match = regex.exec(lineContent)) !== null) {
      const matchingGroup = match[1]; // Group 1 captures the value inside the parentheses
      const start = match.index;
      const end = start + match[0].length;
      foundIds.push({ id: matchingGroup, start, end });
    }

    const promises = foundIds.map(async ({ id, start, end }) => {
      return {
        vidoc: await this.vidocFactory.initVidocObject(id),
        range: {
          from: {
            lineIndex: lineNumber,
            charIndex: start,
            lineContent,
          },
          to: {
            lineIndex: lineNumber,
            charIndex: end,
            lineContent,
          },
          text: lineContent,
        },
      };
    });

    return await Promise.all(promises);
  }

  async parseFileForVidoc(fullContent: string): Promise<PositionedVidocInstance[]> {
    const lines = fullContent.split("\n");
    let vidocs: PositionedVidocInstance[] = [];
    for (let i = 0; i < lines.length; ++i) {
      const matches = await this.parseLineForVidoc(
        lines[i],
        i
      );
      vidocs = [...vidocs, ...matches];
    }
    return vidocs;
  }
}
