import { useEffect } from "react";
import { EyeClosedIcon, EyeIcon } from "../../ui/Icons";
import useUIStore from "../../../stores/UIStore";

function ToggleInterfaceButton() {
    const interfaceHidden = useUIStore((s) => s.interfaceHidden);
    const toggleInterface = useUIStore((s) => s.toggleInterface);

    const label = `${interfaceHidden ? "Show" : "Hide"} interface (H)`;

    // H toggles the interface too
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() !== "h" || e.ctrlKey || e.metaKey || e.altKey) return;
            const target = e.target as HTMLElement;
            if (target.closest("input, textarea, select, [contenteditable]")) return;
            toggleInterface();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [toggleInterface]);

    return (
        <button
            type="button"
            className="media-controls__button"
            onClick={toggleInterface}
            aria-label={label}
            aria-pressed={interfaceHidden}
            title={label}
        >
            {interfaceHidden ? <EyeClosedIcon /> : <EyeIcon />}
        </button>
    );
}

export default ToggleInterfaceButton;