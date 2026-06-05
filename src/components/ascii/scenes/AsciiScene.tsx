import useAsciiRenderStore from "../../../stores/asciiRenderStore";
import Logo from "../general/Logo";
import Fireworks from "../general/Fireworks";
import HomeScene from "./HomeScene";
import useSceneStore from "../../../stores/sceneStore";
import ContactScene from "./ContactScene";
import WorkScene from "./WorkScene";

function AsciiScene() {
    const isGridReady = useAsciiRenderStore((s) => s.isGridReady);
    const isTouch = useSceneStore((s) => s.isTouch);
    const page = useSceneStore((s) => s.page);
    const asciiSequence = useAsciiRenderStore((s) => s.asciiSequence);

    if (!isGridReady) return null;
    if (asciiSequence.length === 0) return null;

    return (
        <>
            {/* Main Lighting */}
            <hemisphereLight intensity={1} />

            <Logo />

            {page === "home" && <HomeScene />}
            {page === "work" && <WorkScene />}
            {page === "contact" && <ContactScene />}

            {!isTouch && <Fireworks />}
        </>
    );
}

export default AsciiScene;
