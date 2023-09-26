import { injectable } from "tsyringe";
import { WindowSelector } from "../../../interfaces/WindowSelector";
import * as win from "./win-info/winInfo";

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Screen extends Rect {
  index: number;
  scale: {
    x: number;
    y: number;
  };
}

export interface WinInfoWindowInformation {
  title: string;
  id: number;
  bounds: Rect;
  screens: Screen[];
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
  async selectWindow(): Promise<WinInfoWindowInformation> {
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

    return info!;
  }
}
