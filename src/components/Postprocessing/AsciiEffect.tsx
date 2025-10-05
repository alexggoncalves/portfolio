import { Color, NearestFilter, RepeatWrapping, Texture, Uniform } from "three";
import { useMemo, forwardRef } from "react";
import { useControls } from "leva";
import { BlendFunction, Effect } from "postprocessing";

import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";

import { CanvasTexture } from "three";

const fragmentShader = `
    uniform sampler2D uFontMap;
    uniform float uCharLength;
    uniform float uCharSize;
    uniform bool uColorOverride;
    uniform vec3 uColor;

    float grayscale(vec3 c) {
        return c.x * 0.299 + c.y * 0.587 + c.z * 0.114;
    }

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec2 cSize = vec2(8.,8.);                   // Size of each character in the font map
        float cLength = cSize.x * cSize.y;          // Total number of characters in the font map

        vec2 division = resolution / uCharSize;     // Number of characters that fit on the screen (horizontally and vertically)
        vec2 d = 1. / division;                        // Size of each character on the screen (in UV coordinates)

        vec2 pixelizationUv = d * (floor(uv / d) + 0.5);

        vec4 color = texture(inputBuffer, pixelizationUv);

        // Convert to grayscale (brightness)
        // Find the character in the font map that corresponds to this brightness
        float gray = grayscale(color.rgb);
    
        float cIndex = floor( gray * uCharLength);
        float cIndexX = mod(cIndex, cSize.x);
        float cIndexY = floor(cIndex / cSize.x);
  
        vec2 offset = vec2(cIndexX, cIndexY) / cSize;
        vec2 charUV = fract(uv * division) / cSize;  // fractional inside cell, normalized for font map cell size
        float ascii = texture(uFontMap, charUV + offset).a;
        
        if(color.a == 0.) {
            ascii = 0.;
        }

        if(uColorOverride) {
            color.rgb = uColor;
        }
        
        outputColor = vec4(color.rgb * ascii, ascii);
    }
`;

let uFontMap: Texture;
let uCharSize: number;
let uCharLength: number;
let uColorOverride: boolean;
let uColor: Color;

type AsciiEffectProps = {
    fontMap?: Texture;
    charSize?: number;
    charLength?: number;
    colorOverride?: boolean;
    color?: Color;
};

// Effect implementation
class AsciiEffectImpl extends Effect {
    constructor({
        fontMap = null,
        charSize = 8,
        charLength = 64,
        colorOverride = false,
        color = new Color("#ffffff"),
    }: AsciiEffectProps) {
        super("AsciiEffect", fragmentShader, {
            blendFunction: BlendFunction.NORMAL,
            uniforms: new Map<string, Uniform<any>>([
                ["uCharSize", new Uniform(charSize)],
                ["uFontMap", new Uniform(fontMap)],
                ["uCharLength", new Uniform(charLength)],
                ["uColorOverride", new Uniform(colorOverride)],
                ["uColor", new Uniform(color)],
            ]),
        });

        uCharSize = charSize;
        uFontMap = fontMap;
        uCharLength = charLength;
        uColorOverride = colorOverride;
        uColor = color;
    }

    update() {
        this.uniforms.get("uFontMap")!.value = uFontMap;
        this.uniforms.get("uCharSize")!.value = uCharSize;
        this.uniforms.get("uCharLength")!.value = uCharLength;
        this.uniforms.get("uColorOverride")!.value = uColorOverride;
        this.uniforms.get("uColor")!.value = uColor;
    }
}

function createFontTexture(
    width = 1024,
    height = 1024,
    fontSize = 128,
    cellSize = 128
) {
    const size = 8;
    const characters =
        "@%#WMB8&$#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:         ";

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, width, height);

    const texture = new CanvasTexture(canvas);

    ctx.font = `${fontSize}px monospace`;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const charactersArray = characters.split("");
    charactersArray.forEach((character, i) => {
        const x = (i % size) * cellSize + cellSize / 2;
        const y = Math.floor(i / size) * cellSize + cellSize / 2;

        ctx.fillStyle = "white";
        ctx.fillText(character, x, y);
    });

    texture.needsUpdate = true;

    return texture;
}

// Effect component
export const AsciiEffect = forwardRef<AsciiEffectImpl, AsciiEffectProps>(
    ({}, ref) => {
        const fontMap = useLoader(TextureLoader, "/font-map.png");
        // const fontMap = createFontTexture();

        const { charSize, charLength, colorOverride, color } = useControls({
            charSize: { value: 12, min: 1, max: 20, step: 1 },
            charLength: { value: 64, min: 2, max: 128, step: 1 },
            colorOverride: false,
            color: { value: "#ffffff" },
        });

        const colorObj = useMemo(() => new Color(color), [color]);

        const effect = useMemo(
            () =>
                new AsciiEffectImpl({
                    fontMap,
                    charSize,
                    charLength,
                    colorOverride,
                    color: colorObj,
                }),
            [fontMap, charSize, charLength, colorOverride, colorObj]
        );
        return <primitive ref={ref} object={effect} dispose={null} />;
    }
);
