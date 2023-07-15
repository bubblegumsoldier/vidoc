export interface OutputFilePathGenerator {
    getNextOutputFilePath(): Promise<string>;
}