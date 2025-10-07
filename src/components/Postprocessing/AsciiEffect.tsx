import {
    Color,
    NearestFilter,
    RepeatWrapping,
    Texture,
    Uniform,
    CanvasTexture,
    ClampToEdgeWrapping,
} from "three";
import { useMemo, forwardRef, useEffect } from "react";
import { useControls } from "leva";
import { BlendFunction, Effect } from "postprocessing";

import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";
import useAsciiStore from "../../stores/asciiStore";

const fragmentShader = `
    uniform sampler2D uFontAtlas;
    uniform float uCharLength;
    uniform float uCharSize;
    uniform bool uColorOverride;
    uniform vec3 uColor;

    float grayscale(vec3 c) {
        return c.x * 0.299 + c.y * 0.587 + c.z * 0.114;
    }

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec2 atlasGridSize = vec2(10.,10.);                        // Size of the atlas grid
        float cLength = atlasGridSize.x * atlasGridSize.y;          // Total number of characters in the font atlas

        vec2 division = resolution / uCharSize;     // Number of characters that fit on the screen (horizontally and vertically)
        vec2 d = uCharSize / resolution;            // Size of each character on the screen (in UV coordinates)

        vec2 pixelizationUv = d * (floor(uv / d) + 0.5);

        vec4 color = texture(inputBuffer, pixelizationUv);

        // Convert to grayscale (brightness)
        float gray = grayscale(color.rgb);
        if (color.a == 0.0) discard;
    
        // Find the character in the font map that corresponds to the brightness
        float cIndex = floor(gray * (uCharLength - 1.0));
        float cIndexX = mod(cIndex, atlasGridSize.x);
        float cIndexY = floor(cIndex / atlasGridSize.x);
  
        vec2 offset = vec2(cIndexX, cIndexY) / atlasGridSize;


        vec2 charCellUV = fract(uv * division);          // correct fractional position inside the cell [0..1)
        vec2 cellSize = 1.0 / atlasGridSize;
        vec2 sampleUV = offset + charCellUV * cellSize;  // final UV inside the font atlas
        
        
        float ascii =  texture(uFontAtlas, sampleUV).r;


        if(uColorOverride) {
            color.rgb = gray * uColor;
        }

        float alpha = ascii * color.a;
        
        outputColor = vec4(color.rgb * ascii, alpha);
    }
`;

let uFontAtlas: Texture;
let uCharSize: number;
let uCharLength: number;
let uColorOverride: boolean;
let uColor: Color;

type AsciiEffectProps = {
    fontAtlas: Texture;
    charSize?: number;
    charLength?: number;
    colorOverride?: boolean;
    color?: Color;
};

// Effect implementation
class AsciiEffectImpl extends Effect {
    constructor({
        fontAtlas,
        charSize = 16,
        charLength = 64,
        colorOverride = false,
        color = new Color("#ffffff"),
    }: AsciiEffectProps) {
        super("AsciiEffect", fragmentShader, {
            blendFunction: BlendFunction.NORMAL,
            uniforms: new Map<string, Uniform<any>>([
                ["uCharSize", new Uniform(charSize)],
                ["uFontAtlas", new Uniform(fontAtlas)],
                ["uCharLength", new Uniform(charLength)],
                ["uColorOverride", new Uniform(colorOverride)],
                ["uColor", new Uniform(color)],
            ]),
        });

        uCharSize = charSize;
        uFontAtlas = fontAtlas;
        uCharLength = charLength;
        uColorOverride = colorOverride;
        uColor = color;
    }

    update() {
        this.uniforms.get("uFontAtlas")!.value = uFontAtlas;
        this.uniforms.get("uCharSize")!.value = uCharSize;
        this.uniforms.get("uCharLength")!.value = uCharLength;
        this.uniforms.get("uColorOverride")!.value = uColorOverride;
        this.uniforms.get("uColor")!.value = uColor;
    }
}

// Effect component
export const AsciiEffect = forwardRef(
    ({ fontAtlasSrc, charSize }: { fontAtlasSrc: string, charSize: number }, ref) => {
        const fontAtlas = useLoader(TextureLoader, fontAtlasSrc);

        const {setCharSize} = useAsciiStore()

        const { cSize, charLength, colorOverride, color } = useControls({
            cSize: { value: charSize, min: 1, max: 50, step: 2 },
            charLength: { value: 100, min: 2, max: 128, step: 1 },
            colorOverride: false,
            color: { value: "#ffffff" },
        });

        const colorObj = useMemo(() => new Color(color), [color]);

        useEffect(()=>{
           setCharSize (cSize)
        },[cSize])

        const effect = useMemo(
            () =>
                new AsciiEffectImpl({
                    fontAtlas,
                    charSize,
                    charLength,
                    colorOverride,
                    color: colorObj,
                }),
            [fontAtlas, cSize, charLength, colorOverride, colorObj]
        );
        return <primitive ref={ref} object={effect} dispose={null} />;
    }
);
