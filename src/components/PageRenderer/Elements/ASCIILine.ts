import type { Color, Vector2 } from "three";
import Color4 from "three/src/renderers/common/Color4.js";
import { brightnessMap, Element } from "../Element";

//-----------------------------------------
// Ascii Line Class
//-----------------------------------------

export class ASCIILine extends Element {
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
        ui: CanvasRenderingContext2D,
        _background: CanvasRenderingContext2D,
    ): void {
        const brightness = brightnessMap.get(this.char);

        const color = new Color4(
            this.color.r,
            this.color.g,
            this.color.b,
            brightness,
        );

        this.drawASCIILine(
            this.pointA,
            this.pointB,
            this.strokeWidth,
            color,
            ui,
        );
    }

    update(): void {}

    fadeIn(): void {}

    fadeOut(): void {}
}
