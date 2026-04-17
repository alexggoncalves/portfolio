import { Vector2 } from "three";
import Color4 from "three/src/renderers/common/Color4.js";

export class RenderConfig {
    static charSize = new Vector2(12, 16);
    static gridSize = new Vector2();
    static canvasSize = new Vector2();
    static bgColor = new Color4(0.1, 0.1, 0.1, 1)
    static distortion = new Vector2(0.02, 0.02);
    static focalLength = new Vector2(0.96, 0.96);

    static atlasGridSize = new Vector2(16, 9)
    static asciiSequence = `       \`·.-\',_:;\"~°º!¡ª÷+=^|)<>(\\/L«≈»v*c[¿?T±rxi≤≥zuìí]t√l7Y{nJ}IFjyîsç1oúùeπaCµ24ZhVfûk3P¢òóE£w95èpXébàáS6mAUGÇqôdH#KΩêÉOãâD&%R0Æ8NBMg@QW$░▒▓█`
    static fontAtlas = "/font_atlas/fontAtlas-ibmplex-16x9(12-16).png";

    static setBackgroundColor(color: Color4){
        this.bgColor.copy(color);
    }

    static setGridSize(w: number, h: number){
        this.gridSize.set(w,h);
        this.canvasSize.set(w * this.charSize.x, h * this.charSize.y)
    }
}

export const createBrightnessMap = (asciiSequence: string) => {
    const asciiArray = asciiSequence.split("");
    const map = new Map<string, number>();

    asciiArray.forEach((char, index) => {
        let mappedBrightness = index / asciiArray.length + 0.002; //  Offset brightness to avoid rounding to wrong value

        map.set(char, mappedBrightness);
    });

    return map;
};
