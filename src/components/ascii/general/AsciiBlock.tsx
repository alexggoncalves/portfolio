import { Mesh, MeshBasicMaterial, NoBlending } from "three";
import { useLayoutEffect, useMemo, useRef } from "react";
import useAsciiRenderStore from "../../../stores/asciiRenderStore";
import { createTextureFromAscii } from "./asciiBlocks";
import { FORCED_ASCII_LAYER, setRenderLayer } from "./asciiLayers";
import { useFrame } from "@react-three/fiber";
import { damp } from "three/src/math/MathUtils.js";

export default function AsciiBlock({
    ascii,
    position = [0, 0, 0],
}: {
    ascii: string[];
    position?: [number, number, number];
}) {
    const meshRef = useRef<Mesh>(null);
    const materialRef = useRef<MeshBasicMaterial>(null);
    const opacity = useRef(0);

    useLayoutEffect(() => {
        setRenderLayer(meshRef.current, FORCED_ASCII_LAYER);
    }, []);

    useFrame((_, delta) => {
        opacity.current = damp(opacity.current, 1, 4, delta);

        if (materialRef.current) {
            materialRef.current.opacity = opacity.current;
        }
    });

    const viewCellSize = useAsciiRenderStore((s) => s.viewCellSize);
    const asciiSequence = useAsciiRenderStore((s) => s.asciiSequence);
    const atlasCellCount = useAsciiRenderStore(
        (s) => s.atlasGridSize.cols * s.atlasGridSize.rows,
    );

    const texture = useMemo(() => {
        return createTextureFromAscii(ascii, atlasCellCount, asciiSequence);
    }, [ascii, atlasCellCount, asciiSequence]);

    const blockSize = useMemo(() => {
        const h = ascii.length;
        let w = ascii[0]?.length ?? 0;

        for (let i = 1; i < ascii.length; i++) {
            w = Math.max(w, ascii[i]!.length);
        }
        return {
            w: w * viewCellSize.w,
            h: h * viewCellSize.h,
        };
    }, [ascii, viewCellSize]);

    const snappedPosition = useMemo(() => {
        const halfW = blockSize.w / 2;
        const halfH = blockSize.h / 2;
        const left = position[0] - halfW;
        const topY = position[1] + halfH;

        const snappedLeft = Math.round(left / viewCellSize.w) * viewCellSize.w;
        const snappedTopY = Math.round(topY / viewCellSize.h) * viewCellSize.h;

        const x = snappedLeft + halfW;
        const y = snappedTopY - halfH;
        const z = position[2] ?? 0;
        return [x, y, z] as [number, number, number];
    }, [position, viewCellSize, blockSize.w, blockSize.h]);

    return (
        <>
            {/* Image plane */}
            <mesh ref={meshRef} position={snappedPosition} renderOrder={999}>
                <planeGeometry args={[blockSize.w, blockSize.h]} />
                <meshBasicMaterial
                    ref={materialRef}
                    transparent
                    map={texture}
                    depthTest={false}
                    depthWrite={false}
                    toneMapped={false}
                    blending={NoBlending}
                />
            </mesh>
        </>
    );
}
