import { injectable } from "tsyringe";
import * as vscode from "vscode";
import { Notificator } from "../../../interfaces/Notificator";


@injectable()
export class CLINotificator implements Notificator
{
    warn(message: string): void {
        // don't print, we don't want to ruin the JSON output
    }
    error(message: string): void {
    }
    success(message: string): void {
    }
    info(message: string): void {
    }
}