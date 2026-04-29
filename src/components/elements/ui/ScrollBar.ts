import { AsciiRenderConfig } from "../../app/AsciiRenderConfig";
import { Element } from "../core/Element";
import { Slider } from "./Slider";

//-------------------------------
//          ScrollBar LAYER
//-------------------------------

export class ScrollBar extends Slider {
    cornerRadius: number;
    // Dragging state
    mouseX: number = -1;
    mouseY: number = -1;

    knobPadding: number = 4;
    knobW: number;
    knobH: number;

    pageHeight: number = 100;

    scrollOffset: number = 0;
    knobPosition: number = 0;

    constructor(
        x: number,
        y: number,
        w: number,
        h: number,
        cornerRadius: number,
    ) {
        super(x, y, w, h, "pixel", "white", "right", "middle");
        this.setSize(w, h, "pixel");
        this.applyAlignment();

        this.knobW = this.w - this.knobPadding * 2;
        this.trackSize = this.h - this.knobPadding * 2;

        this.knobH =
            (AsciiRenderConfig.gridSize.y * this.trackSize) / this.pageHeight;

        this.cornerRadius = cornerRadius;

        // Scroll values
        this.isScrollable = false;
    }

    // update(_delta: number, yOffset: number): void {
    //     super.update(_delta, yOffset);
    // }

    updatePageHeight(value: number) {
        this.pageHeight = value;
        // Recalculate knob height
        this.knobH =
            (AsciiRenderConfig.gridSize.y * this.trackSize) / this.pageHeight;
    }

    updateScrollOffset(value: number) {
        this.scrollOffset = value;

        this.knobPosition =
            (this.scrollOffset * this.trackSize) / this.pageHeight;
    }

    draw(
        _ui: CanvasRenderingContext2D,
        background: CanvasRenderingContext2D,
    ): void {
        // Draw container
        Element.drawRect(
            this.x,
            this.y,
            this.w,
            this.h,
            this.w / 2,
            true,
            this.color,
            background,
        );

        // Draw Knob
        Element.drawRect(
            this.x + this.knobPadding,
            this.y + this.knobPadding + this.knobPosition,
            this.knobW,
            this.knobH,
            this.knobW / 2,
            false,
            this.color,
            background,
        );
    }

    destroy(): void {
        super.destroy();
    }
}
