import "./styles/css/index.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import App from "./components/app/App.tsx";
import { StrictMode } from "react";
// import ErrorElement from "./components/OLD/ErrorElement.tsx";

const root = document.getElementById("root");

if (!root) throw new Error("Root element not found");

ReactDOM.createRoot(root).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route index element={null} />
                <Route path="projects" element={null}>
                    <Route path=":projectId" element={null} />
                </Route>
                <Route path="contacts" element={null} />
                <Route path="more" element={null} />
                <Route path="*" element={null} />
            </Routes>
            <App></App>
        </BrowserRouter>
    </StrictMode>,
);
