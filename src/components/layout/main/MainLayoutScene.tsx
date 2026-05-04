import { GradientTexture, useScroll } from "@react-three/drei";
import HomepageLayout from "./homepage/HomepageLayout";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { MultiplyBlending, type Group } from "three";
import useAsciiRenderStore from "../../../stores/asciiRenderStore";

function MainLayoutScene() {
    const pageContainer = useRef<Group>(null);
    const lastOffsetY = useRef<number | null>(null);
    const { viewport } = useThree();

    const bgColor = useAsciiRenderStore((state) => state.bgColor);

    const scroll = useScroll();

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
            <group ref={pageContainer} position={[0, 0, -0.1]}>
                <HomepageLayout></HomepageLayout>
            </group>

            {/* Top gradient */}
            <mesh position={[0, viewport.height / 2 - 0.9, -0.05]}>
                <planeGeometry args={[viewport.width + 1, 2]} />
                <meshBasicMaterial
                    transparent
                    premultipliedAlpha
                    blending={MultiplyBlending}
                    // depthWrite={false}
                    opacity={0.6}
                    depthWrite={false}
                    depthTest={false}
                    toneMapped={false}
                >
                    <GradientTexture
                        stops={[0, 1]}
                        colors={[bgColor, "white"]}
                    />
                </meshBasicMaterial>
            </mesh>
        </>
    );
}

export default MainLayoutScene;
