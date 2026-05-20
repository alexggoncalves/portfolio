import { Text3D, useAspect } from "@react-three/drei";
import { useRef } from "react";
import { useThree } from "@react-three/fiber";
import { Container, Content } from "@react-three/uikit";
import { Group } from "three";
import useAsciiRenderStore from "../../../../stores/asciiRenderStore";

const headerH = 1.4; // world units

function Logo({ text }: { text: string }) {
    const { viewport, size } = useThree();
    const charSize = useAsciiRenderStore((s) => s.charSize);

    const rootRef = useRef<Group>(null);

    const scale = useAspect(size.width, size.height, 3)[1];

    return (
        <group
            ref={rootRef}
            position={[0, viewport.height / 2 - headerH / 2, 0]}
        >
            <Container
                sizeX={viewport.width}
                alignItems={"center"}
                sizeY={headerH}
                marginTop={charSize.h * 2}
                marginLeft={charSize.w * 5}
            >
                <Content positionType={"relative"} sizeY={headerH * 0.8}>
                    <Text3D
                        rotation={[0, 0, 0]}
                        font={"/fonts/IBMPlexMono_Regular.json"}
                        scale={[scale, scale, scale]}
                        position={[0, 0, 0]}
                        renderOrder={100}
                    >
                        {text}
                        <meshBasicMaterial
                            color="white"
                            depthTest={false}
                            depthWrite={false}
                            toneMapped={false}
                        />
                    </Text3D>
                </Content>
            </Container>
        </group>
    );
}

export default Logo;
