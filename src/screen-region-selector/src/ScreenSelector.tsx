import { useEffect, useState } from "react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";

export default function ScreenSelector() {
    const [shouldNavigate, setShouldNavigate] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!shouldNavigate) {
            return;
        }
        navigate("/region-selector");
    }, [shouldNavigate]);

    return (
        <div className="screen-selector" data-tauri-drag-region>
            <h1 data-tauri-drag-region>Drag onto target screen</h1>

            <button type="button" onClick={() => setShouldNavigate(true)}>
                Select Screen Area
            </button>
        </div>
    );
}
