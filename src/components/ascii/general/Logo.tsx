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
    useEffect(() => {
        texture.minFilter = NearestFilter;
        texture.magFilter = NearestFilter;
        texture.generateMipmaps = false;
        texture.colorSpace = SRGBColorSpace;
    }, [texture]);

    // Logo size in world units
    const blockSize = useMemo(() => {
        const imgW = 30; // cells
        const imgH = 7; // cells

        return {
            w: imgW * viewCellSize.w,
            h: imgH * viewCellSize.h,
        };
    }, [viewCellSize]);

    // top-left of screen in world units
    const topLeft = useMemo(() => {
        return {
            x: -viewport.width / 2,
            y: viewport.height / 2,
        };
    }, [viewport.width, viewport.height]);

    // Align to top left
    const position: [number, number, number] = [
        topLeft.x + (extraColumns + 1) * viewCellSize.w + blockSize.w / 2,

        topLeft.y - extraRows * viewCellSize.h - blockSize.h / 2,

        0,
    ];

    return (
        <mesh position={position} renderOrder={999}>
            <planeGeometry args={[blockSize.w, blockSize.h]} />
            <meshBasicMaterial
                transparent
                map={texture}
                depthTest={false}
                depthWrite={false}
            />
        </mesh>
    );
}

export default Logo;
