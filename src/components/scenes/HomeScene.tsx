import getWorldPosition from "../../utils/getWorldPosition";
import getWorldScale, { getObjectSize } from "../../utils/getWorldScale";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import type { Vector3 } from "three";
import CatSection from "./CatSection";
import { RenderConfig } from "../render/RenderConfig";
import { AppState } from "../app/AppState";

function HomeScene() {
    const { camera, size } = useThree();

    const wordRef = useRef<any>(null);
    const groupRef = useRef<any>(null);

    const baseSize = useRef<Vector3 | null>(null);


    useFrame((_state, _delta) => {
        if (!wordRef.current || !groupRef.current) return;
        
        const homeScrollOffset = AppState.pageScrolls["home"];
        const pageSize = AppState.pageHeight

        // Get original object size once
        if (!baseSize.current) {
            const size = getObjectSize(wordRef.current);
            if (size.x === 0 || size.y === 0) return;
            baseSize.current = size;
        }

        const worldPos = getWorldPosition(
            { x: RenderConfig.gridSize.x/2, y: RenderConfig.gridSize.y/2 -homeScrollOffset },
            6,
            camera,
            size,
            "grid",
            RenderConfig.gridSize,
        );

        const worldScale = getWorldScale(
            {
                width:  Math.min(pageSize/(homeScrollOffset), RenderConfig.gridSize.x),
                height: 20,
            },
            baseSize.current,
            6,
            camera,
            size,
            "grid",
            RenderConfig.charSize,
        );

        groupRef.current.position.copy(worldPos);
        groupRef.current.scale.set(worldScale.x, worldScale.y, 1);
    });

    return (
        <>
            <group ref={groupRef} scale={[1, 1, 1]}>
                {/* <Text3D
                    ref={wordRef}
                    font={"/fonts/IBMPlexMono_Regular.json"}
                    lineHeight={0.6}
                >
                    CREATIVE{`\n`}
                    DEVELOPER
                    <meshBasicMaterial color={"tomato"}/>
                </Text3D> */}
            </group>

            <CatSection></CatSection>
        </>
    );
}

export default HomeScene;
