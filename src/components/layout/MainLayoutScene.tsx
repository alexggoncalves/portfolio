import { GradientTexture, useScroll } from "@react-three/drei";
import HomepageLayout from "./main/homepage/HomepageLayout";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { MultiplyBlending, type Group } from "three";
import { Container, Content } from "@react-three/uikit";
import { AsciiRenderConfig } from "../app/config/AsciiRenderConfig";

function MainLayoutScene() {
    // const currentScroll = useRef(0)
    const pageContainer = useRef<Group>(null);
    const { size, viewport } = useThree();

    const scroll = useScroll();

    useFrame(() => {
        if (!pageContainer.current) return;

        pageContainer.current?.position.setY(scroll.offset * scroll.pages);
    });

    return (
        <>
            <group ref={pageContainer} position={[0, 0, 0]}>
                <HomepageLayout></HomepageLayout>
            </group>

            {/* Gradient */}
            <Container
                // backgroundColor={"red"}
                sizeX={viewport.width}
                sizeY={viewport.height}
            >
                <Content sizeX={viewport.width} sizeY={200}>
                    <mesh>
                        <planeGeometry args={[viewport.width, 2]} />
                        <meshBasicMaterial
                            transparent
                            premultipliedAlpha
                            blending={MultiplyBlending}
                            // depthWrite={false}
                            opacity={0.9}
                        >
                            <GradientTexture
                                stops={[0, 1]} // As many stops as you want
                                colors={[
                                    AsciiRenderConfig.bgColor,
                                    "transparent",
                                ]}
                            />
                        </meshBasicMaterial>
                    </mesh>
                </Content>
            </Container>
        </>
    );
}

export default MainLayoutScene;
