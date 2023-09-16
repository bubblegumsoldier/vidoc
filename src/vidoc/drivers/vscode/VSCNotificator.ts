import { injectable } from "tsyringe";
import { Notificator } from "../../interfaces/Notificator";
import * as vscode from "vscode";


@injectable()
export class VSCNotificator implements Notificator
{
    warn(message: string): void {
        vscode.window.showWarningMessage(message);
    }
    error(message: string): void {
        vscode.window.showErrorMessage(message);
    }
    success(message: string): void {
        vscode.window.showInformationMessage(message);
    }
    info(message: string): void {
        vscode.window.showInformationMessage(message);
    }
}