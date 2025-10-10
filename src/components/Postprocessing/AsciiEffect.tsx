import { CanvasTexture, Color, Texture, Uniform, Vector2 } from "three";
import { useMemo, forwardRef, useEffect } from "react";
import { useControls } from "leva";
import { BlendFunction, Effect } from "postprocessing";

import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";
import useAsciiStore from "../../stores/asciiStore";

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
        float atlasCount = uAtlasGridSize.x * uAtlasGridSize.y;
    
        vec2 division = resolution / uCharSize;     // Number of characters that fit on the screen (horizontally and vertically)
        vec2 d = uCharSize / resolution;            // Size of each character on the screen (in UV coordinates)

        vec2 pixelizationUv = d * (floor(uv / d) + 0.5);

        vec4 color = texture(inputBuffer, pixelizationUv);
        vec4 uiColor = texture(uUITexture,pixelizationUv);
        vec4 backgroundColor = texture(uBackgroundTexture, uv);

        // Convert to grayscale (brightness)
        float gray = grayscale(color.rgb);
        
        if(uiColor.a > 0.) {
            gray = uiColor.a;
        }
    
        // Find the character in the font map that corresponds to the brightness
        float cIndex = floor(gray * (atlasCount - 1.0));
        float cIndexX = mod(cIndex, uAtlasGridSize.x);
        float cIndexY = floor(cIndex / uAtlasGridSize.x);

        vec2 offset = vec2(cIndexX, cIndexY) / uAtlasGridSize;
        vec2 atlasTexel = 1.0 / uAtlasGridSize;
        vec2 charCellUV = fract(uv * division); 
        vec2 sampleUV = offset + charCellUV * atlasTexel;  // final UV inside the font atlas
        
        // Sample from font atlas
        float ascii =  texture(uFontAtlas, sampleUV).r;

        // Choose final color layer
        vec3 finalColor;
        float alpha = 1.0;

        if (uiColor.a > 0.) {
            if (backgroundColor.a > 0.) {
                // blend background and text using ascii
                vec3 bgMix = mix(color.rgb, backgroundColor.rgb, backgroundColor.a);
                finalColor = mix(bgMix, uiColor.rgb, ascii);
                alpha = mix(backgroundColor.a, uiColor.a * ascii, ascii);
            } else {
                finalColor = uiColor.rgb * ascii;
                alpha = uiColor.a * ascii;
            }
        } else {
            if (backgroundColor.a > 0.) {
                vec3 bgMix = mix(color.rgb * ascii, backgroundColor.rgb, backgroundColor.a);
                finalColor = mix(bgMix, color.rgb, ascii);
                alpha = backgroundColor.a;
            } else {
                finalColor = color.rgb * ascii;
                alpha = ascii;
            }
        }

        // Output final color
        outputColor = vec4(finalColor, alpha);
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
            [fontAtlas, uiTexture, backgroundTexture, charSize]
        );
        return <primitive ref={ref} object={effect} dispose={null} />;
    }
);
