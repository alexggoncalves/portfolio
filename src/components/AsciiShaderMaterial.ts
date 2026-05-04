import { ShaderMaterial, Texture, Vector2 } from "three";
import asciiShader from "./postprocessing/asciiShader";

const createAsciiShaderMaterial = (
    atlas: Texture,
    atlasSize: { cols: number; rows: number },
    gridSize: { cols: number; rows: number },
    cellSize: { w: number; h: number },
    glyphThreshold: number,
    glyphSoftness: number,
) => {
    const gridSizeVec = new Vector2(gridSize.cols, gridSize.rows);
    const atlasSizeVec = new Vector2(atlasSize.cols, atlasSize.rows);
    const cellSizeVec = new Vector2(cellSize.w, cellSize.h);

    return new ShaderMaterial({
        transparent: true,
        depthTest: false,
        depthWrite: false,
        vertexShader: asciiShader.vertexShader,
        fragmentShader: asciiShader.fragmentShader,
        uniforms: {
            uPixelizedTex: { value: null },
            uGridResolution: {
                value: gridSizeVec,
            },
            uAsciiAtlas: { value: atlas },
            uAtlasGridResolution: {
                value: atlasSizeVec,
            },
            uCharSize: { value: cellSizeVec },
            uGlyphThreshold: { value: glyphThreshold },
            uGlyphSoftness: { value: glyphSoftness },
            uAtlasInsetPx: { value: 0.0 },
        },
    });
};

export default createAsciiShaderMaterial;
