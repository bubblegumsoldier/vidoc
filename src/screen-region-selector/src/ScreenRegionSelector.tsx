import React, { useState, MouseEvent, useEffect } from "react";
import {
    appWindow,
    availableMonitors,
    currentMonitor,
} from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/tauri";

interface Rect {
    left: number;
    top: number;
    width: number;
    height: number;
}

interface ScreenInformation {
    id: string;
    index: number;
    name: string;
    position: { x: number; y: number };
    scaleFactor: number;
    size: { width: number; height: number };
}

interface OutputInformation {
    rect: Rect;
    screens: ScreenInformation[];
    selectedScreenIndex: number;
}

interface BoxStyle {
    left: string;
    top: string;
    width: string;
    height: string;
    display: string;
}

const initialBoxStyle: BoxStyle = {
    left: "0px",
    top: "0px",
    width: "0px",
    height: "0px",
    display: "none",
};

export const ScreenRegionSelector: React.FC = () => {
    const [isNonInteractiveMode, setIsNonInteractiveMode] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [topBoxStyle, setTopBoxStyle] = useState<BoxStyle>(initialBoxStyle);
    const [bottomBoxStyle, setBottomBoxStyle] =
        useState<BoxStyle>(initialBoxStyle);
    const [leftBoxStyle, setLeftBoxStyle] = useState<BoxStyle>(initialBoxStyle);
    const [rightBoxStyle, setRightBoxStyle] =
        useState<BoxStyle>(initialBoxStyle);
    const [centerBoxStyle, setCenterBoxStyle] =
        useState<BoxStyle>(initialBoxStyle);
    const [rect, setRect] = useState<Rect | null>(null);

    const log = (msg: string) => {
        invoke("log_message", { message: msg });
    };

    const enableNonInteractiveMode = async () => {
        await appWindow.setIgnoreCursorEvents(true);
    };

    const printOutputInformation = async () => {
        const screens: ScreenInformation[] = (await availableMonitors()).map(
            (screen, index) => ({
                id: index.toString(),
                index: index,
                name: screen.name || "",
                position: { x: screen.position.x, y: screen.position.y },
                scaleFactor: screen.scaleFactor,
                size: { width: screen.size.width, height: screen.size.height },
            })
        );
        const currentMonitorObject = await currentMonitor();
        const currentMonitorIndex = screens.findIndex(
            (screen) => screen.name === (currentMonitorObject?.name || "")
        );
        const outputInformation: OutputInformation = {
            rect: rect!,
            screens,
            selectedScreenIndex: currentMonitorIndex
        };
        log(`[RESULT] ${JSON.stringify(outputInformation)}`);
    };

    useEffect(() => {
        if (isNonInteractiveMode) {
            enableNonInteractiveMode().catch((err) => {
                log(`[ERROR] Error enabling non interactive mode: ${err}`);
            });
            printOutputInformation().catch((err) => {
                log(`[ERROR] Error printing output information: ${err}`);
            });
        }
    }, [isNonInteractiveMode]);

    useEffect(() => {
        appWindow.setAlwaysOnTop(true);
        appWindow.setFullscreen(true);
        appWindow.setResizable(false);
        document.body.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    }, []);

    const onMouseDown = (e: MouseEvent) => {
        if (isNonInteractiveMode) {
            return;
        }
        setStartX(e.pageX);
        setStartY(e.pageY);
        setIsDragging(true);
        document.body.style.backgroundColor = "rgba(255, 255, 255, 0)";
        updateOverlayBoxes(e.pageX, e.pageY, e.pageX, e.pageY);
        setRect({
            left: Math.min(e.pageX, e.pageX),
            top: Math.min(e.pageY, e.pageY),
            width: Math.abs(e.pageX - e.pageX),
            height: Math.abs(e.pageY - e.pageY),
        });
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        updateOverlayBoxes(startX, startY, e.pageX, e.pageY);
        setRect({
            left: Math.min(startX, e.pageX),
            top: Math.min(startY, e.pageY),
            width: Math.abs(e.pageX - startX),
            height: Math.abs(e.pageY - startY),
        });
    };

    const onMouseUp = (e: MouseEvent) => {
        if (!isDragging) return;
        setIsDragging(false);
        setIsNonInteractiveMode(true);
    };

    const updateOverlayBoxes = (
        x1: number,
        y1: number,
        x2: number,
        y2: number
    ) => {
        setTopBoxStyle({
            left: "0px",
            top: "0px",
            width: "100%",
            height: `${Math.min(y1, y2)}px`,
            display: "block",
        });

        setBottomBoxStyle({
            left: "0px",
            top: `${Math.max(y1, y2)}px`,
            width: "100%",
            height: `calc(100vh - ${Math.max(y1, y2)}px)`,
            display: "block",
        });

        setLeftBoxStyle({
            left: "0px",
            top: `${Math.min(y1, y2)}px`,
            width: `${Math.min(x1, x2)}px`,
            height: `${Math.abs(y2 - y1)}px`,
            display: "block",
        });

        setRightBoxStyle({
            left: `${Math.max(x1, x2)}px`,
            top: `${Math.min(y1, y2)}px`,
            width: `calc(100vw - ${Math.max(x1, x2)}px)`,
            height: `${Math.abs(y2 - y1)}px`,
            display: "block",
        });

        setCenterBoxStyle({
            left: `${Math.min(x1, x2)}px`,
            top: `${Math.min(y1, y2)}px`,
            width: `${Math.abs(x2 - x1)}px`,
            height: `${Math.abs(y2 - y1)}px`,
            display: "block",
        });
    };

    return (
        <div
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            style={{ width: "100%", height: "100%", position: "absolute" }}
            className="region-selector"
        >
            <div style={topBoxStyle} className="overlay-box"></div>
            <div style={bottomBoxStyle} className="overlay-box"></div>
            <div style={leftBoxStyle} className="overlay-box"></div>
            <div style={rightBoxStyle} className="overlay-box"></div>
            <div style={centerBoxStyle} className="center-box"></div>
        </div>
    );
};
