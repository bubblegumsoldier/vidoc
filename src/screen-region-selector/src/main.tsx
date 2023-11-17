import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ScreenSelector from "./ScreenSelector";
import { ScreenRegionSelector } from "./ScreenRegionSelector";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ScreenSelector></ScreenSelector>,
  },
  {
    path: "/region-selector",
    element: <ScreenRegionSelector></ScreenRegionSelector>
  }
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
