import React, { useState, MouseEvent, useEffect } from "react";
import { appWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/tauri";

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
  const [rightBoxStyle, setRightBoxStyle] = useState<BoxStyle>(initialBoxStyle);
  const [centerBoxStyle, setCenterBoxStyle] = useState<BoxStyle>(initialBoxStyle);

  const log = (msg: string) => {
    invoke("log_message", { message: msg });
  };

  const enableNonInteractiveMode = async () => {
    await appWindow.setIgnoreCursorEvents(true);
  };


  useEffect(() => {
    if (isNonInteractiveMode) {
      enableNonInteractiveMode()
        .then(() => {
          log("Non interactive mode enabled");
        })
        .catch((err) => {
          log(`Error enabling non interactive mode: ${err}`);
        });
      log("Non interactive mode activated");
    }
  }, [isNonInteractiveMode]);

  useEffect(() => {
    log("ScreenRegionSelector mounted");
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
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    updateOverlayBoxes(startX, startY, e.pageX, e.pageY);
  };

  const onMouseUp = (e: MouseEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    log("Setting non interactive mode");
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
