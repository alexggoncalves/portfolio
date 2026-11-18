import useSceneStore from "../../../stores/sceneStore";
import { CameraIcon, ReturnIcon, VinylIcon } from '../../ui/Icons';
import PhotoControls from "./PhotoControls";

const HeroControls = () => {
    const view = useSceneStore((s) => s.view)
    const setView = useSceneStore((s) => s.setView)

    return <>
        <div className={`scene-control-buttons ${view === "Camera" ? "scene-control-buttons--bar" : ""}`}>
            {view === "Camera" && <PhotoControls />}
            
            {view === "Center" ? (<>
                <button
                    type="button"
                    className={`button--glass`}
                    onClick={() => setView('Camera')}
                >
                    <CameraIcon />
                </button>

                <button
                    type="button"
                    className={`button--glass`}
                    onClick={() => setView('Music')}
                >
                    <VinylIcon />
                </button>

            </>) : <button
                type="button"
                className={`button--glass back-button`}
                onClick={() => setView('Center')}
            >
                <ReturnIcon />
                <span>Return</span>
            </button>}

            
        </div>
    </>
}

export default HeroControls;