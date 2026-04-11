import type { Color, Vector2 } from "three";
import type Color4 from "three/src/renderers/common/Color4.js";
import { Element } from "../core/Element";

//-----------------------------------------
// Ascii Block Class
//-----------------------------------------
export class AsciiBlock extends Element {
    text: string; // Ascii formated string

    constructor(
        text: string,
        position: Vector2,
        color: Color,
        backgroundColor: Color4,
        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom",
    ) {
        super(position, color, backgroundColor, horizontalAlign, verticalAlign);

        this.text = text;
        this.setSize(this.text);
        this.applyAlignment();
    }

    draw(
        asciiCtx: CanvasRenderingContext2D,
        bgCtx: CanvasRenderingContext2D,
    ): void {
        this.drawBlock(this.text, asciiCtx, bgCtx);
    }
}
