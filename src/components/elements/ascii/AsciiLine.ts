import type { Color, Vector2 } from "three";
import Color4 from "three/src/renderers/common/Color4.js";
import { brightnessMap, Element } from "../core/Element";

//-----------------------------------------
// Ascii Line Class
//-----------------------------------------

export class AsciiLine extends Element {
    char: string; // character for the line
    pointA: Vector2;
    pointB: Vector2;
    strokeWidth: number;

    constructor(
        char: string,
        pointA: Vector2,
        pointB: Vector2,
        strokeWidth: number,
        color: Color,
        backgroundColor: Color4,
        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom",
    ) {
        super(pointA, color, backgroundColor, horizontalAlign, verticalAlign);

        this.char = char;
        this.setSize(this.char);
        // this.applyAlignment();

        this.strokeWidth = strokeWidth;
        this.pointA = pointA;
        this.pointB = pointB;
    }

    draw(
        asciiCtx: CanvasRenderingContext2D,
        _bgCtx: CanvasRenderingContext2D,
    ): void {
        const brightness = brightnessMap.get(this.char) || 0;

        this.drawASCIILine(
            this.pointA.x,
            this.pointA.y,
            this.pointB.x,
            this.pointB.y,
            this.strokeWidth,
            this.color.r,
            this.color.g,
            this.color.b,
            brightness,
            asciiCtx,
        );
    }

    update(): void {}

    fadeIn(): void {}

    fadeOut(): void {}
}
