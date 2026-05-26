import useAsciiRenderStore from "../../stores/asciiRenderStore";
import Logo from "./general/Logo";
import HomeScene from "./homepage/HomeScene";

function AsciiScene() {
    const isGridReady = useAsciiRenderStore((s)=>s.isGridReady)

    if(!isGridReady) return null;

    return (
        <>
            {/* Main Lighting */}
            <hemisphereLight intensity={1} />

            <Logo/>

            <group>
                <HomeScene></HomeScene>
            </group>

        </>
    );
}

export default AsciiScene;
