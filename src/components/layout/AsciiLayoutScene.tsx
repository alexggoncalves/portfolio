// import HomeScene from "./HomeScene";
import { useRef } from "react";
import NamePlate from "./ascii/NamePlate";
import type { Group } from "three";
import { useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import HomeScene from "./ascii/HomeScene";

function AsciiLayoutScene() {
    const pageContainer = useRef<Group>(null);
    const {camera} = useThree()
    const scroll = useScroll();

    useFrame((state) => {
        if (!pageContainer.current) return;

        pageContainer.current?.position.setY(scroll.offset * scroll.pages);
    });

    return (
        <>
            {/* Main Lighting */}
            <hemisphereLight intensity={1.5} />

            {/* My big animated name that also serves as the small header logo */}
            <NamePlate text={"ALEX"} />

            <group ref={pageContainer}>
                <HomeScene></HomeScene>
            </group>

            
        </>
    );
}

export default AsciiLayoutScene;
