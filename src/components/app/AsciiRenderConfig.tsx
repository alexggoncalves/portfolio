import { Vector2 } from "three";

export class AsciiRenderConfig {
    static charSize = new Vector2(12, 16);
    static gridSize = new Vector2();
    static canvasSize = new Vector2();
    static bgColor = "rgb(28, 26, 29)";
    static distortion = new Vector2(0.02, 0.02);
    static focalLength = new Vector2(0.96, 0.96);

    
    static fontAtlas = "/font_atlas/fontAtlas-ibmplex-16x9(12-16).png";
    static atlasGridSize = new Vector2(16, 9);

    static asciiSequence = `       \`·.-\',_:;\"~°º!¡ª÷+=^|)<>(\\/L«≈»v*c[¿?T±rxi≤≥zuìí]t√l7Y{nJ}IFjyîsç1oúùeπaCµ24ZhVfûk3P¢òóE£w95èpXébàáS6mAUGÇqôdH#KΩêÉOãâD&%R0Æ8NBMg@QW$░▒▓█`;

    static extraColumns = 1;
    static extraRows = 1;

    static setBackgroundColor(color: string) {
        this.bgColor = color;
    }

    static setGridSize(w: number, h: number) {
        this.gridSize.set(w, h);
        this.canvasSize.set(w * this.charSize.x, h * this.charSize.y);
    }
}
