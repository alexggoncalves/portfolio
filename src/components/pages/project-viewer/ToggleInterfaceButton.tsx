import { EyeClosedIcon, EyeIcon } from "../../general/Icons";
import useUIStore from "../../../stores/UIStore";


function ToggleInterfaceButton() {
    const interfaceHidden = useUIStore((s) => s.interfaceHidden);
    const toggleInterface = useUIStore((s) => s.toggleInterface);

    return (
        <button
            type="button"
            onClick={toggleInterface}
            className="hide-interface__button"
        >
            {interfaceHidden ? <EyeClosedIcon /> : <EyeIcon />}
            <span>{interfaceHidden ? "Show " : "Hide "} interface</span>
        </button>
    );
}

export default ToggleInterfaceButton;
