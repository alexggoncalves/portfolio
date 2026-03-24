import { Text3D } from "@react-three/drei";
import { useRef } from "react";
import useAsciiStore from "../../stores/asciiStore";
import { useFrame, useThree } from "@react-three/fiber";
import getWorldPosition from "../../utils/getWorldPosition";
import { Vector3 } from "three";
import getWorldScale, { getObjectSize } from "../../utils/getWorldScale";
import useSceneStore from "../../stores/sceneStore";

function NamePlate({ text }: { text: string }) {
    const { camera, size } = useThree();

    const wordRef = useRef<any>(null);
    const groupRef = useRef<any>(null);
    const baseSize = useRef<Vector3 | null>(null);

    const { gridSize, charSize } = useAsciiStore();

    useFrame((_state, _delta) => {
        if (!wordRef.current || !groupRef.current) return;

        const homeScrollOffset = useSceneStore.getState().pageScrolls["home"];

        // Get original object size once
        if (!baseSize.current) {
            const size = getObjectSize(wordRef.current);
            if (size.x === 0 || size.y === 0) return;
            baseSize.current = size;
        }

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
