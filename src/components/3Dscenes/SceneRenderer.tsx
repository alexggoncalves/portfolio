// import HomeScene from "./HomeScene";
import useSceneStore from "../../stores/sceneStore";
import HomeScene from "./HomeScene";
import NamePlate from "./NamePlate";

function SceneRenderer() {
    const { isReady } = useSceneStore();

    if (isReady)
        return (
            <>
                {/* Main Lighting */}
                <hemisphereLight intensity={1.5} />

                {/* My big animated name that also serves as the small header logo */}
                <NamePlate text={"ALEX"} />

                <HomeScene></HomeScene>
            </>
        );
}

export default SceneRenderer;
