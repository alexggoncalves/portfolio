import { Color, Vector2 } from "three";
import Color4 from "three/src/renderers/common/Color4.js";

import { InteractiveElement } from "../core/InteractiveElement";
import type { Unit } from "../core/Element";

//------------------------------------------
// Button Class
//------------------------------------------

export class AsciiButton extends InteractiveElement {
    text: string = ""; // Text to display on button
    callback: () => void; // Button's function
    

    constructor(
        text: string,
        callback: () => void,
        x: number,
        y: number,
        color: Color,
        backgroundColor: Color4,

        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom",
        size?: Vector2,
        resetCursorOnClick?: boolean,
    ) {
        super(x,y,"grid", color, backgroundColor, horizontalAlign, verticalAlign);

        this.text = text;
        this.isInteractive = true;
        this.callback = callback;

        if (!size) {
            this.setSize(this.text);
        } else this.setSize(size.x, size.y, "grid");

        this.applyAlignment();

        if (resetCursorOnClick != undefined)
            this.resetCursorOnClick = resetCursorOnClick;
    }

    drawButtonFrame(
        strokeWeight: number,
        context: CanvasRenderingContext2D,
    ): void {
        // Set color and stroke
        context.strokeStyle = `rgba(${this.color.r * 255},
        ${this.color.g * 255},
        ${this.color.b * 255},
        ${this.opacity})`;
        context.lineWidth = strokeWeight;

        // Draw frame
        context.strokeRect(
            this.x,
            this.y,
            this.w,
            this.h,
        );
    }

    update(): void {
        super.update();
    }

    draw(
        ui: CanvasRenderingContext2D,
        background: CanvasRenderingContext2D,
    ): void {
        this.drawBlock(this.text, ui, background);

        if (this.isMouseOver) {
            this.drawButtonFrame(2, background);
        }
    }

    onClick(): void {
        super.onClick();
        if (this.callback) this.callback();
    }

    destroy(): void {
        this.callback = undefined as any
        super.destroy()
    }
}
