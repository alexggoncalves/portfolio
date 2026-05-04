// import HomeScene from "./HomeScene";
import { useRef } from "react";
import Logo from "./general/Logo";
import { Group, MultiplyBlending } from "three";
import { GradientTexture, useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import HomeScene from "./homepage/HomeScene";

function AsciiLayoutScene() {
    const pageContainer = useRef<Group>(null);
    const lastOffsetY = useRef<number | null>(null);
    const scroll = useScroll();

    const { viewport } = useThree();

    useFrame(() => {
        if (!pageContainer.current) return;
        const nextOffsetY = scroll.offset * scroll.pages;

        if (
            lastOffsetY.current !== null &&
            Math.abs(nextOffsetY - lastOffsetY.current) < 0.0001
        ) {
            return;
        }

        pageContainer.current.position.setY(nextOffsetY);
        lastOffsetY.current = nextOffsetY;
    });

    return (
        <>
            {/* Main Lighting */}
            <hemisphereLight intensity={0.7} />

            {/* My big animated name that also serves as the small header logo */}
            <Logo text={"ALEX"} />

            <group ref={pageContainer}>
                <HomeScene></HomeScene>
            </group>

            {/* Top gradient */}
            <mesh position={[0, viewport.height / 2 - 0.5, 0]} renderOrder={50}>
                <planeGeometry args={[viewport.width + 1, 2]} />
                <meshBasicMaterial
                    transparent
                    premultipliedAlpha
                    blending={MultiplyBlending}
                    depthWrite={false}
                    depthTest={false}
                    toneMapped={false}
                    // opacity={1}
                >
                    <GradientTexture
                        stops={[0, 1]}
                        colors={["black", "white"]}
                    />
                </meshBasicMaterial>
            </mesh>
        </>
    );
}

export default AsciiLayoutScene;
