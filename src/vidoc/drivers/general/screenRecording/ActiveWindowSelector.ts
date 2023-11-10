import { injectable } from "tsyringe";
import { WindowSelector } from "../../../interfaces/WindowSelector";
import * as win from "./win-info/winInfo";
import {
    BoundsInformation,
    RecordingAreaInformation,
    ScreenInformation,
} from "../../../model/Vidoc";

export interface WinInfoWindowInformation {
    title: string;
    id: number;
    bounds: BoundsInformation;
    screens: ScreenInformation[];
    owner: {
        name: string;
        processId: number;
        bundleId?: string;
        path: string;
    };
    memoryUsage?: number;
}

@injectable()
export class ActiveWindowSelector implements WindowSelector {
    async selectWindow(): Promise<RecordingAreaInformation> {
        const info = await win.getActive();
        const b = info.bounds!;

        if (process.platform !== "darwin") {
            if (process.platform === "win32") {
                const multiplier = info.screens[0].scale.x;
                b.width = Math.trunc(b.width * multiplier);
                b.height = Math.trunc(b.height * multiplier);
                b.x = Math.trunc(b.x * multiplier);
                b.y = Math.trunc(b.y * multiplier);
            }
            b.width += b.width % 2;
            b.height += b.height % 2;
            b.x -= b.x % 2;
            b.y -= b.y % 2;
        }

        return {
            bounds: b,
            screen: info.screens[0],
        };
    }
}
