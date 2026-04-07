import { Text3D } from "@react-three/drei";
import { useEffect, useRef } from "react";
import useAsciiStore from "../../stores/asciiStore";
import { useFrame, useThree } from "@react-three/fiber";
import getWorldPosition from "../../utils/getWorldPosition";
import { Vector3 } from "three";
import getWorldScale, { getObjectSize } from "../../utils/getWorldScale";
import useSceneStore from "../../stores/sceneStore";

function NamePlate({ text }: { text: string }) {
    const { camera, size } = useThree();

    const homeScrollOffset = useSceneStore(
        (state) => state.pageScrolls["home"],
    );

    const wordRef = useRef<any>(null);
    const groupRef = useRef<any>(null);
    const baseSize = useRef<Vector3 | null>(null);

    const { gridSize, charSize } = useAsciiStore();

    useEffect(() => {
        if (!baseSize.current && wordRef.current) {
            baseSize.current = getObjectSize(wordRef.current);
        }
    }, []);

    useFrame((_state, _delta) => {
        if (!wordRef.current || !groupRef.current || !baseSize.current) return;

        const worldPos = getWorldPosition(
            { x: -2, y: gridSize.y - homeScrollOffset },
            5,
            camera,
            size,
            "grid",
            gridSize,
        );

        const worldScale = getWorldScale(
            {
                width: gridSize.x,
                height: gridSize.y - homeScrollOffset,
            },
            baseSize.current,
            5,
            camera,
            size,
            "grid",
            charSize,
        );

        // setScrollPosition(scrollPosition + delta)
        groupRef.current.position.copy(worldPos);
        groupRef.current.scale.set(worldScale.x, worldScale.y, 1);
    });

    return (
        <>
            <group ref={groupRef} position={[0, 0, 0]} scale={[1, 1, 1]}>
                <Text3D
                    ref={wordRef}
                    scale={[1, 1, 1]}
                    font={"/fonts/IBMPlexMono_Regular.json"}
                >
                    {text}
                    <meshBasicMaterial color={"white"} />
                </Text3D>
            </group>
        </>
    );
}

export default NamePlate;
