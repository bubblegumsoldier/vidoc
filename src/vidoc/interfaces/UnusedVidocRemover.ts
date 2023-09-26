
export interface UnusedVidocRemover {
    removeUnusedVidocs(): Promise<string[]> ;
    findUnusedFiles(usedVidocIds: string[]): Promise<string[]>;
}