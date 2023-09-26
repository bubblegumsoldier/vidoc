import { injectable } from "tsyringe";
import * as vscode from "vscode";
import { Notificator } from "../../../interfaces/Notificator";


@injectable()
export class CLINotificator implements Notificator
{
    warn(message: string): void {
        console.warn(message);
    }
    error(message: string): void {
        console.error(message);
    }
    success(message: string): void {
        console.info(message);
    }
    info(message: string): void {
        console.info(message);
    }
}