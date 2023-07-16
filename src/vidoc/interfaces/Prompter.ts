export declare type PromptOption = string;

export interface Prompter {
    getAnswer(question: string, options: PromptOption[]): Promise<PromptOption|undefined>;
}