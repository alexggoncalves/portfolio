import { CanvasTexture, NearestFilter } from "three";
import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import useAsciiStore from "../stores/asciiStore";
import type { element } from "three/tsl";

type AsciiGlyphFieldProps = {
    charSize: number;
};

function AsciiGlyphField({ charSize }: AsciiGlyphFieldProps) {
    const { viewport, size, camera } = useThree();

    const { width, height } = size;

    const { asciiSequence } = useAsciiStore();

    // console.log(asciiSequence)

    const brightnessMap = useMemo(() => {
        const asciiArray = asciiSequence.split("");
        const map = new Map<string, number>();

        asciiArray.forEach((char, index) => {
            const mappedBrightness = index / (asciiArray.length - 1);
            map.set(char, mappedBrightness);
        });

        console.log(map);

        return map;
    }, [asciiSequence]);

    function createTexture(width: number, height: number) {
        const canvas = document.createElement("canvas");
        canvas.width = (width / charSize) * viewport.dpr;
        canvas.height = (height / charSize) * viewport.dpr;

        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, width, height);

        drawFrame(ctx);

        const texture = new CanvasTexture(canvas);

        texture.magFilter = NearestFilter;
        texture.minFilter = NearestFilter;
        texture.generateMipmaps = false;
        texture.needsUpdate = true;

        return texture;
    }

    const drawFrame = (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = "white";
        ctx.fillRect(1, 1, ctx.canvas.width - 2, 1);
        ctx.fillRect(1, 1, 1, ctx.canvas.height - 2);
        ctx.fillRect(ctx.canvas.width - 2, 1, 1, ctx.canvas.height - 2);
        ctx.fillRect(1, ctx.canvas.height - 2, ctx.canvas.width - 2, 1);

        ctx.beginPath();
        ctx.ellipse(20, 20, 10, 10, 0, 0, 2 * Math.PI); // x, y, radiusX, radiusY, rotation, startAngle, endAngle
        ctx.fill();
    };

    const texture = useMemo(
        () => createTexture(size.width, size.height),
        [size, charSize]
    );

    // compute how large the plane must be at z=0 to cover the screen from this camera
    const z = 0;
    const distance = camera.position.z - z;
    const fovInRad = (45 * Math.PI) / 180;

    const visibleHeight = 2 * Math.tan(fovInRad / 2) * distance;
    const visibleWidth = visibleHeight * viewport.aspect;

    return (
        <mesh position={[0, 0, z]}>
            <planeGeometry args={[visibleWidth, visibleHeight]} />
            <meshBasicMaterial map={texture} transparent={true} />
        </mesh>
    );
}

export default AsciiGlyphField;
