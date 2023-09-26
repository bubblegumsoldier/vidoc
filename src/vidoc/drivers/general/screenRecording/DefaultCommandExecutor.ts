import { injectable } from "tsyringe";
import {
  CommandExecutionReference,
  CommandExecutor,
  CommandResult,
} from "../../../interfaces/CommandExecutor";
import * as child_process from "child_process";

@injectable()
export class DefaultCommandExecutor implements CommandExecutor {
  async processToPromise(
    cmd: string,
    args: any[]
  ): Promise<CommandExecutionReference> {
    console.info([cmd, ...args].join(" "));

    const proc = child_process.spawn(
      process.platform === "win32" ? `"${cmd}"` : cmd,
      args,
      {
        shell: true,
      }
    );

    proc.stderr!.on("data", (x) => console.debug(x.toString().trim()));

    const kill = (now: boolean = false) => {
      if (!now) {
        (proc as any).quitting = !now;
        proc.kill("SIGTERM");
      } else {
        proc.kill("SIGKILL");
      }
    };

    const done = () => kill.bind(null, false);

    process.on("exit", done);

    const finish = new Promise<void>((resolve, reject) => {
      proc.once("error", () => {
        reject(new Error(`Cannot start ${cmd}`));
      });

      proc.once("exit", (code) => {
        process.removeListener("exit", done);
        console.info("Successfully terminated");
        resolve();
      });
    });

    return { finish, kill, proc };
  }

  async executeProcess(cmd: string, args: string[]): Promise<CommandResult> {
    const { proc, finish } = await this.processToPromise(cmd, args);
    const output = {
      stdout: [] as Buffer[],
      stderr: [] as Buffer[],
      success: false,
    };
    proc.stderr!.removeAllListeners("data");

    proc.stdout!.on("data", (v: any) => output.stdout.push(v));
    proc.stderr!.on("data", (v: any) => output.stderr.push(v));

    try {
      await finish;
      output.success = true;
    } catch (e) {
      throw new Error(Buffer.concat(output.stderr).toString());
    }

    return {
      success: output.success,
      stderr: Buffer.concat(output.stderr).toString(),
      stdout: Buffer.concat(output.stdout).toString(),
    };
  }
}
