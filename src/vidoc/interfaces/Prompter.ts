export declare type PromptOption = string;

export interface Prompter {
    getAnswer(question: string, options: PromptOption[], defaultValue: PromptOption): Promise<PromptOption|undefined>;
}