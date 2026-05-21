import Logo from "./general/Logo";
import HomeScene from "./homepage/HomeScene";

function AsciiScene() {

    return (
        <>
            {/* Main Lighting */}
            <hemisphereLight intensity={1} />

            {/* My big animated name that also serves as the small header logo */}
            <Logo text={"ALEX"} />

            <group>
                <HomeScene></HomeScene>
            </group>

        </>
    );
}

export default AsciiScene;
