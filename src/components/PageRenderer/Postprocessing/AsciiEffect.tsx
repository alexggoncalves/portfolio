import { CanvasTexture, LinearFilter, NearestFilter, Texture, Uniform, Vector2 } from "three";
import { useMemo, forwardRef, useEffect } from "react";
import { BlendFunction, Effect } from "postprocessing";
import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";

// import { useControls } from "leva";

const fragmentShader = `
    uniform sampler2D uFontAtlas;
    uniform sampler2D uUITexture;
    uniform sampler2D uBackgroundTexture;

    uniform vec2 uCharSize;
    uniform vec2 uAtlasGridSize;
    uniform float uPixelDensity;

    float grayscale(vec3 c) {
        return c.x * 0.299 + c.y * 0.587 + c.z * 0.114;
    }

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        float atlasCount = uAtlasGridSize.x * uAtlasGridSize.y; // number of cells in the ascii atlas

        // Calculate UV to sample pixelized colors from input buffer
        vec2 division = resolution / uCharSize;     // Number of characters that fit on the screen (horizontally and vertically)
        vec2 d = uCharSize / resolution;            // Size of each character on the screen (in UV coordinates)
        vec2 pixelizationUv = d * (floor(uv / d) + 0.5);
        
        // Sample colors from the pixelized input buffer and from already pixelized UI texture
        vec4 pixelizedColor = texture(inputBuffer, pixelizationUv);
        vec4 uiColor = texture(uUITexture,pixelizationUv);
        
        // Sample color from background texture and adjust it's gamma
        vec4 backgroundColor = texture(uBackgroundTexture, uv);
        backgroundColor.rgb = pow(backgroundColor.rgb, vec3(2.2)); 

        // Convert to grayscale (brightness)
        float gray = grayscale(pixelizedColor.rgb);
        
        // If there is UI on this pixel override the gray value (place UI on top)
        if(uiColor.a > 0.) {
            gray = grayscale(vec3(uiColor.a));
        }
    
        // Find the character in the font map that corresponds to the brightness
        float cIndex = floor(gray * (atlasCount - 0.001));
        float cIndexX = mod(cIndex, uAtlasGridSize.x);
        float cIndexY = floor(cIndex / uAtlasGridSize.x);

        // Get UV corresponding to the right ascii character in the atlas
        vec2 offset = vec2(cIndexX, cIndexY) / uAtlasGridSize;
        vec2 atlasTexel = 1.0 / uAtlasGridSize;
        vec2 charCellUV = fract(uv * division); 
        vec2 atlasUV = offset + charCellUV * atlasTexel;

        float ascii = texture(uFontAtlas, atlasUV).r;

        // Smooth, subtle contrast adjustment
        float sharpness = 2.0;  // Much gentler sharpening
        ascii = clamp((ascii - 0.5) * sharpness + 0.5, 0.0, 1.0);
        ascii = pow(ascii, 2.0);  // Softer contrast curve


        // Determine base color for this pixel
        vec3 baseColor = backgroundColor.rgb;
        if(ascii > 0.0){
            if(uiColor.a > 0.0) baseColor = uiColor.rgb;
            else baseColor = pixelizedColor.rgb;
        }
            
        // Blend ASCII over background using its "opacity" (ascii)
        vec3 finalColor = mix(backgroundColor.rgb, baseColor, ascii);

        outputColor = vec4(finalColor, 1.0);
    }
`;

type AsciiEffectProps = {
    fontAtlas: Texture;
    uiTexture: Texture | null;
    backgroundTexture: Texture | null;
    charSize?: Vector2;
    atlasGridSize?: Vector2;
    pixelDensity: number;
};

// Effect implementation
class AsciiEffectImpl extends Effect {
    constructor({
        fontAtlas,
        uiTexture,
        backgroundTexture,
        charSize,
        atlasGridSize,
        pixelDensity,
    }: AsciiEffectProps) {
        super("AsciiEffect", fragmentShader, {
            blendFunction: BlendFunction.NORMAL,
            uniforms: new Map<string, Uniform<any>>([
                ["uFontAtlas", new Uniform(fontAtlas)],
                ["uUITexture", new Uniform(uiTexture)],
                ["uBackgroundTexture", new Uniform(backgroundTexture)],

                ["uCharSize", new Uniform(charSize)],
                ["uAtlasGridSize", new Uniform(atlasGridSize)],
                ["uPixelDensity", new Uniform(pixelDensity)],
            ]),
        });
    }
}

// Effect component
export const AsciiEffect = forwardRef(
    (
        {
            fontAtlasSrc,
            charSize,
            atlasGridSize,
            uiTexture,
            backgroundTexture,
        }: {
            fontAtlasSrc: string;
            charSize: Vector2;
            atlasGridSize: Vector2;
            uiTexture: CanvasTexture;
            backgroundTexture: CanvasTexture;
        },
        ref
    ) => {
        // Load font atlas
        const fontAtlas = useLoader(TextureLoader, fontAtlasSrc);
        const pixelDensity = window.devicePixelRatio;

        const effect = useMemo(
            () =>
                new AsciiEffectImpl({
                    fontAtlas,
                    uiTexture,
                    backgroundTexture,
                    charSize,
                    atlasGridSize,
                    pixelDensity,
                }),
            [
                fontAtlas,
                uiTexture,
                backgroundTexture,
                charSize.x,
                charSize.y,
                atlasGridSize.x,
                atlasGridSize.y,
                pixelDensity,
            ]
        );
        return <primitive ref={ref} object={effect} dispose={null} />;
    }
);
