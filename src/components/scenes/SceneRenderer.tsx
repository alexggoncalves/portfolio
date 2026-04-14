// import HomeScene from "./HomeScene";
import useSceneStore from "../../stores/sceneStore";
import HomeScene from "./HomeScene";
import NamePlate from "./NamePlate";

function SceneRenderer() {
    const {isReady} = useSceneStore();

    if(isReady)
    return (
        <>
            {/* Main Lighting */}
            <hemisphereLight intensity={1.5} />
            {/* <pointLight
                position={[-10, 20, 2]}
                intensity={3}
                castShadow
                shadow-mapSize={[128,128]}
            />

            <pointLight
                position={[10, 20, 2]}
                intensity={3}
                castShadow
                shadow-mapSize={[128,128]}
            /> */}

            {/* My big animated name that also serves as the small header logo */}
            <NamePlate text={"ALEX"}/>

            <HomeScene></HomeScene>

        </>
    );
}

export default SceneRenderer;
