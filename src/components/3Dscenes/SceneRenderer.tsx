// import HomeScene from "./HomeScene";
import HomeScene from "./HomeScene";
import NamePlate from "./NamePlate";

function SceneRenderer() {
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
