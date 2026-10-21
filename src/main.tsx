import "./styles/index.scss"
import "./styles/buttons.scss"
import "./components/interface/window.scss"

import ReactDOM from "react-dom/client";

import App from "./components/App.tsx";
import { StrictMode } from "react";

const root = document.getElementById("root");

if (!root) throw new Error("Root element not found");

ReactDOM.createRoot(root).render(
    <StrictMode>
        <App></App>
    </StrictMode>
);
