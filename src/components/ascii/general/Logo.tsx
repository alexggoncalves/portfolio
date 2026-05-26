import { useTexture } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { NearestFilter, SRGBColorSpace } from "three";
import useAsciiRenderStore from "../../../stores/asciiRenderStore";

function Logo() {
    const texture = useTexture("/images/LOGO.webp");

    const viewCellSize = useAsciiRenderStore((s) => s.viewCellSize);
    const extraColumns = useAsciiRenderStore((s) => s.extraColumns);
    const extraRows = useAsciiRenderStore((s) => s.extraRows);

    const { viewport } = useThree();

    // --- texture setup ---
    useEffect(() => {
        texture.minFilter = NearestFilter;
        texture.magFilter = NearestFilter;
        texture.generateMipmaps = false;
        texture.colorSpace = SRGBColorSpace;
    }, [texture]);

    // --- logo size in ASCII cells → world units ---
    const blockSize = useMemo(() => {
        const imgW = 30; // cells
        const imgH = 7;  // cells

        return {
            w: imgW * viewCellSize.w,
            h: imgH * viewCellSize.h,
        };
    }, [viewCellSize]);

    // --- top-left of screen in world space ---
    const topLeft = useMemo(() => {
        return {
            x: -viewport.width / 2,
            y: viewport.height / 2,
        };
    }, [viewport.width, viewport.height]);

    // --- grid position (ASCII coordinates) ---
    const gridPos = { x: extraColumns, y: extraRows };

    // --- final snapped position (top-left anchored) ---
    const position: [number, number, number] = [
        topLeft.x +
            gridPos.x * viewCellSize.w +
            blockSize.w / 2,

        topLeft.y -
            gridPos.y * viewCellSize.h -
            blockSize.h / 2,

        0,
    ];

    return (
        <mesh position={position}>
            <planeGeometry args={[blockSize.w, blockSize.h]} />
            <meshBasicMaterial
                transparent
                map={texture}
            />
        </mesh>
    );
}

export default Logo;