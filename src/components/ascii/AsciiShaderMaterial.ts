import { ShaderMaterial, Texture, Vector2 } from "three";

const vertexShader = `
    varying vec2 vUv;
    
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform sampler2D uPixelizedTex; // Pixelized texture the same size as grid
    uniform sampler2D uForcedPixelizedTex; // Pixelized texture for the forced ascii

    uniform vec2 uGridResolution; // Resolution of the pixelized render target(==ascii grid size)
    uniform vec2 uCharSize; // Size of each ascii character

    uniform sampler2D uAsciiAtlas; // Font atlas texture
    uniform vec2 uAtlasGridResolution; // Columns and rows of the ascii atlas
    uniform float uGlyphThreshold; // Glyph threshold in [0..1]
    uniform float uGlyphSoftness; // Edge softness multiplier
    uniform float uAtlasInsetPx; // Inset inside each atlas cell in source pixels
    
    varying vec2 vUv;

    float convertToLuma(vec3 c) {
        return c.x * 0.299 + c.y * 0.587 + c.z * 0.114;
    }

    void main() {
     // Total count of atlas cells 
        float atlasCellCount = uAtlasGridResolution.x * uAtlasGridResolution.y;

        vec4 outputColor = vec4(1.0,1.0,1.0, 1.0);
        
        // * Sample one color per ASCII cell at cell center for stable luma
        vec2 cellCoord = floor(vUv * uGridResolution);
        vec2 cellCenterUV = (cellCoord + 0.5) / uGridResolution;
        vec4 pixelColor = texture(uPixelizedTex, cellCenterUV);
        // TODO: Add forced ascii texture (with opacity as luma)
        // TODO: vec4 forcedPixelColor = texture(uForcedPixelizedTex,vUv);

        if(pixelColor.a < 0.001) discard;
        // TODO: if(pixelColor.a < 0.001 && forcedPixelColor.a < 0.001) return;

        // * Convert color to luma
        float luma = convertToLuma(pixelColor.rgb);
        luma = clamp(luma, 0.0, 1.0);

        // * Override luma if there is something in the forced ascii texture
        // TODO: if(forcedPixelColor.a > 0.) {
        // TODO:    luma = convertToLuma(vec3(uiColor.a));
        // TODO: }


        // * Find the character in the font map that corresponds to the brightness
        float cIndex = floor(luma * (atlasCellCount - 0.001));
        float cIndexX = mod(cIndex, uAtlasGridResolution.x);
        float cIndexY = floor(cIndex / uAtlasGridResolution.x);
        vec2 charCellUV = fract(vUv * uGridResolution);
        

        // * Get UV corresponding to the right ascii character in the atlas
        // * snap to atlas texel centers to avoid bleeding/jitter
        vec2 offset = vec2(cIndexX, cIndexY) / uAtlasGridResolution;
        vec2 atlasTexelSize = 1.0 / vec2(textureSize(uAsciiAtlas, 0));
        vec2 atlasCellSize = 1.0 / uAtlasGridResolution;
        vec2 insetUV = (atlasTexelSize * max(uAtlasInsetPx, 0.0)) / atlasCellSize;
        vec2 safeCharCellUV = mix(insetUV, 1.0 - insetUV, charCellUV);
        vec2 atlasUV = offset + safeCharCellUV * atlasCellSize;
        atlasUV = floor(atlasUV / atlasTexelSize) * atlasTexelSize + 0.5 * atlasTexelSize;

        // * Sample glyph pixel
        float glyph = texture(uAsciiAtlas, atlasUV).r;

        // * Apply smoothstep
        float w = max(fwidth(glyph), 0.0005) * max(uGlyphSoftness, 0.001);
        float threshold = clamp(uGlyphThreshold, 0.0, 1.0);
        float ascii = smoothstep(threshold - w, threshold + w, glyph);
        
        outputColor = vec4(pixelColor.rgb,ascii);
        
        // ? ---- TEMP OVERRIDES -----
        // outputColor = pixelColor;  // Display color
        // outputColor = vec4(luma,luma,luma,pixelColor.a); // Display luma
        // ? --------------------------
        
        gl_FragColor = outputColor;
    }
`;

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
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
            uPixelizedTex: { value: null },
            uForcedPixelizedTex: { value: null },
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
