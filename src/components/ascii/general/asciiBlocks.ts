import {
    DataTexture,
    NearestFilter,
    NoColorSpace,
    RGBAFormat,
    UnsignedByteType,
} from "three";

function buildAtlasCharMap(
    asciiSequence: string,
    atlasCellCount: number,
): Map<string, number> {
    const map = new Map<string, number>();
    const seq = asciiSequence.slice(0, atlasCellCount);

    for (let i = 0; i < seq.length; i++) {
        const c = seq[i]!;
        if (!map.has(c)) map.set(c, i);
    }
    return map;
}

export function createTextureFromAscii(
    ascii: string[],
    atlasCellCount: number,
    asciiSequence: string,
): DataTexture {
    const map = buildAtlasCharMap(asciiSequence, atlasCellCount);
    const height = ascii.length;

    let width = ascii[0].length;
    for (let i = 1; i < ascii.length; i++) {
        if (ascii[i].length > width) width = ascii[i].length;
    }

    const data = new Uint8Array(width * height * 4);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const char = ascii[y][x] ?? " ";
            const i = (y * width + x) * 4;

            if (char === " ") {
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 0;
                data[i + 3] = 0;
                continue;
            }

            const atlasIdx = map.get(char);
            if (atlasIdx === undefined) {
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 0;
                data[i + 3] = 0;
                continue;
            }

            const idx = Math.min(atlasIdx, Math.max(0, atlasCellCount - 1));
            const n = Math.max(1, atlasCellCount);
            // Bin center in 0…1 so floor(luma * (N - ε)) == idx in the ASCII shader
            const luma = (idx + 0.5) / n;
            const a = Math.min(255, Math.max(1, Math.round(luma * 255)));

            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
            data[i + 3] = a;
        }
    }

    const texture = new DataTexture(
        data,
        width,
        height,
        RGBAFormat,
        UnsignedByteType,
    );

    texture.needsUpdate = true;

    texture.minFilter = NearestFilter;
    texture.magFilter = NearestFilter;
    texture.generateMipmaps = false;
    // true: first row of `ascii[]` is the top of the art; matches PlaneGeometry UV (v up)
    texture.flipY = true;
    texture.colorSpace = NoColorSpace;
    texture.premultiplyAlpha = false;

    return texture;
}
