import { ASCIIEffect, ASCIITexture } from "postprocessing";
import { Color } from "three";
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

const ASCII = forwardRef(
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

export default ASCII
