import { EffectComposer, Glitch } from "@react-three/postprocessing";
import { TextureLoader, NearestFilter, RepeatWrapping, Color } from "three";

// import { AsciiEffect } from "./AsciiEffect";
import { ASCIIEffect, ASCIITexture } from "postprocessing";

import { useLoader } from "@react-three/fiber";
import { useMemo, forwardRef } from "react";

type AsciiEffectProps = {
    asciiTexture?: ASCIITexture | null;
    cellSize?: number;
    color?: Color | string | number | null;
    inverted?: boolean;
    characters?: string;
    font?: string;
    fontSize?: number;
    size?: number;
    cellCount?: number;
};

export const ASCII = forwardRef(
    (
        {
            cellSize = 5,
            color,
            inverted,
            characters,
            font,
            fontSize,
            size,
            cellCount,
        }: AsciiEffectProps,
        ref
    ) => {
        const asciiTexture = new ASCIITexture({
            characters,
            font,
            fontSize,
            size,
            cellCount,
        });

        const effect = useMemo(
            () => new ASCIIEffect({ asciiTexture, cellSize, color, inverted }),
            [asciiTexture, cellSize, color, inverted]
        );
        return <primitive ref={ref} object={effect} dispose={null} />;
    }
);

function Postprocessing() {
    // const fontMap = useLoader(TextureLoader, "/font-map.png");
    // fontMap.minFilter = NearestFilter;
    // fontMap.magFilter = NearestFilter;
    // fontMap.wrapS = fontMap.wrapT = RepeatWrapping;
    // fontMap.generateMipmaps = false;
    // fontMap.needsUpdate = true;

    // if (!fontMap) {
    //     // Render nothing or a loader while texture loads
    //     return null;
    // }

    return (
        <EffectComposer>
            {/* <AsciiEffect fontMap={fontMap} charLength={64} charSize={8} /> */}
            <ASCII
                cellSize={8}
                characters="`.-':_,^=;><+!rc*/z?sLTv)J7(|Fi{C}fI31tlu[neoZ5Yxjya]2ESwqkP6h9d4VpOGbUAKXHm8RD#$Bg0MNWQ%&@"
            />
            {/* <Glitch
                delay={[1.5, 3.5]} // min and max glitch delay
                duration={[0.1, 0.2]} // min and max glitch duration
                strength={[0.02, 0.1]} // min and max glitch strength
                chromaticAberrationOffset={[0.5, 0.6]} // min and max chromatic aberration offset
            /> */}
        </EffectComposer>
    );
}

export default Postprocessing;
