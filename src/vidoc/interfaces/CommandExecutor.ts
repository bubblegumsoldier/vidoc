export interface CommandResult {
  success: boolean;
  stderr?: string;
  stdout?: string;
}

export interface CommandExecutionReference {
  finish: Promise<void>;
  kill: (now?: boolean) => void;
  proc: any;
}

export interface CommandExecutor {
  processToPromise(cmd: string, args: any[]): Promise<CommandExecutionReference>;
  executeProcess(cmd: string, args: string[]): Promise<CommandResult>;
}
