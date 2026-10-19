import "./window.scss";
import type { ReactNode } from "react";
import { CloseIcon, MinimizeIcon } from "./Icons";

type WindowProps = {
    title: string;
    children: ReactNode;
    header: ReactNode;
    actionType?: "minimize" | "close" | undefined;
    onAction?: () => void;
    className: string;
}

function Window({ title, header, children, actionType = undefined, onAction, className = "" }: WindowProps) {
    const ActionIcon = actionType === "close" ? CloseIcon : MinimizeIcon;
    const actionLabel = actionType === "close" ? "Close" : "Minimize";

    return (
        <div className={`window ${className}`} aria-label={`${title} window`}>
            <div className="window__header">
                {header}
                {actionType &&
                    <button
                        onClick={onAction}
                        className="window__control"
                        aria-label={`${actionLabel} ${title} window`}
                    >
                        <ActionIcon />
                    </button>
                }
            </div>

            <div className="window__content">
                {children}
            </div>
        </div>
    );
}

export default Window;
