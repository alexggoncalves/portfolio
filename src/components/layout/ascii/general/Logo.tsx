import { Text3D } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { Container, Content } from "@react-three/uikit";
import { Group } from "three";

function Logo({ text }: { text: string }) {
    const { viewport } = useThree();

    const rootRef = useRef<Group>(null);

    useEffect(() => {
        if (!rootRef.current) return;
        rootRef.current.traverse((obj) => {
            obj.layers.enable(1);
        });
    }, []);

    return (
        <group ref={rootRef}>
            <Container sizeX={viewport.width} sizeY={viewport.height}>
                <Content
                    positionType={"relative"}
                    positionLeft={50}
                    positionTop={40}
                    sizeX={3}
                    anchorX={"left"}
                    anchorY={"top"}
                >
                    <Text3D
                        rotation={[0, 0, 0]}
                        font={"/fonts/IBMPlexMono_Regular.json"}
                        scale={[1, 1, 1.4]}
                        position={[0, 0, 0]}
                        renderOrder={999}
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
