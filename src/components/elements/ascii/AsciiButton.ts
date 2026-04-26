import { Color } from "three";
import Color4 from "three/src/renderers/common/Color4.js";

import { InteractiveElement } from "../core/InteractiveElement";
import { getAsciiBitmap } from "../../assets/asciiBlocks";
import { Element } from "../core/Element";

//------------------------------------------
// Button Class
//------------------------------------------

export class AsciiButton extends InteractiveElement {
    text: string = ""; // Text to display on button
    callback: () => void; // Button's function

    bitmap: ImageBitmap | null;

    bitmapId: string = "x";

    constructor(
        bitmapId: string,
        callback: () => void,
        x: number,
        y: number,
        color: Color,
        backgroundColor: Color4,

        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom",
    ) {
        super(
            x,
            y,
            "grid",
            color,
            backgroundColor,
            horizontalAlign,
            verticalAlign,
        );

        const bitmap = getAsciiBitmap(bitmapId);
        this.bitmap = bitmap;

        if (!bitmap) this.bitmap = getAsciiBitmap("fallback");

        if (this.bitmap) {
            this.setSize(this.bitmap?.width, this.bitmap?.height, "grid");
        } else this.setSize(1, 10, "grid");

        this.isInteractive = true;
        this.callback = callback;
        // Apply alignment after size is set
        this.applyAlignment();
    }

    drawButtonFrame(
        strokeWeight: number,
        context: CanvasRenderingContext2D,
    ): void {
        // Set color and stroke
        context.strokeStyle = this.colorString;
        context.lineWidth = strokeWeight;

        // Draw frame
        context.strokeRect(this.x, this.y, this.w, this.h);
    }

    update(): void {
        super.update();
    }

    draw(
        ui: CanvasRenderingContext2D,
        background: CanvasRenderingContext2D,
    ): void {
        if (this.bitmap) {
            Element.drawBlock(
                this.bitmap,
                this.gridX,
                this.gridY,
                ui,
                this.opacity,
            );
        } else
            this.drawRect(
                this.x,
                this.y,
                this.w,
                this.h,
                0,
                false,
                this.colorString,
                ui,
            );

        if (this.isMouseOver) {
            this.drawButtonFrame(2, background);
        }
    }

    onClick(): void {
        super.onClick();
        if (this.callback) this.callback();
    }

    destroy(): void {
        this.callback = undefined as any;
        super.destroy();
    }
}
