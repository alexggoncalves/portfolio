import { Text3D } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import getWorldPosition from "../../utils/getWorldPosition";
import { Vector3 } from "three";
import getWorldScale, { getObjectSize } from "../../utils/getWorldScale";
import { AsciiRenderConfig } from "../app/AsciiRenderConfig";
// import useSceneStore from "../../stores/sceneStore";

function NamePlate({ text }: { text: string }) {
    const { camera, size } = useThree();

    // const homeScrollOffset = useSceneStore(
    //     (state) => state.pageScrolls["home"],
    // );

    const wordRef = useRef<any>(null);
    const groupRef = useRef<any>(null);
    const baseSize = useRef<Vector3 | null>(null);

    const logoState = useMemo(() => {
        return {
            position: { x: 6, y: 8 },
            scale: { width: 28, height: 4, depth: 1 },
        };
    }, []);

    // const fullScreenState = useMemo(() => {
    //     return {
    //         position: { x: -2, y: gridSize.y - homeScrollOffset },
    //         scale: {
    //             width: gridSize.x,
    //             height: gridSize.y - homeScrollOffset,
    //             depth: 1,
    //         },
    //     };
    // }, [homeScrollOffset, gridSize.y, gridSize.x]);

    useEffect(() => {
        if (!baseSize.current && wordRef.current) {
            baseSize.current = getObjectSize(wordRef.current);
        }
    }, []);

    useFrame((_state, _delta) => {
        if (!wordRef.current || !groupRef.current || !baseSize.current) return;
        // if (!fullScreenPosition) return;

        const worldPos = getWorldPosition(
            logoState.position,
            5,
            camera,
            size,
            "grid",
            AsciiRenderConfig.gridSize,
        );

        const worldScale = getWorldScale(
            logoState.scale,
            baseSize.current,
            5,
            camera,
            size,
            "grid",
            AsciiRenderConfig.charSize,
        );

        // setScrollPosition(scrollPosition + delta)
        groupRef.current.position.copy(worldPos);
        groupRef.current.scale.set(
            worldScale.x,
            worldScale.y,
            logoState.scale.depth,
        );
    });

    return (
        <>
            <group ref={groupRef} position={[-99, 0, 0]} scale={[1, 1, 1]}>
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
