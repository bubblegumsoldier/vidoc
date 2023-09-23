import { program } from "commander";
import { Buffer } from 'buffer'; // Import Buffer module

export type CommandArg = {
  key: string;
  required: boolean;
  description: string;
  type: "string" | "boolean" | "number";
  isBase64?: boolean;
};

export function registerCommand(
  commandName: string,
  description: string,
  action: (...args: any[]) => Promise<any>,
  args: CommandArg[] = []
) {
  const cmd = program
    .command(commandName)
    .description(description)
    .option("-v, --verbose", "output extra debugging");

  args.forEach((arg) => {
    if (arg.required) {
      cmd.requiredOption(`--${arg.key} <${arg.type}>`, arg.description);
    } else {
      cmd.option(`--${arg.key} [${arg.type}]`, arg.description);
    }
  });

  cmd.action(async (cmdObj) => {
    const isVerbose = cmdObj.verbose;
    
    // Keep references to the original console methods
    const originalDebug = console.debug;
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;
    
    if (!isVerbose) {
      // Override console methods with no-op function
      console.debug = console.log = console.error = console.warn = console.info = () => {};
    }

    try {
      const params = args.map((arg) => {
        // If the argument is marked as Base64, decode it
        if (arg.isBase64) {
          return Buffer.from(cmdObj[arg.key], 'base64').toString('utf-8');
        }
        return cmdObj[arg.key];
      });
      
      const result = await action(...params);
      
      // Restore original console methods before final output
      console.debug = originalDebug;
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      console.info = originalInfo;
      
      console.log(JSON.stringify(result, null, 2));
      process.exit(0);
    } catch (error: any) {
      // Restore original console methods for error output
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      console.info = originalInfo;
      
      console.error(`Error executing ${commandName}:`, error.message);
    }
  });
}
