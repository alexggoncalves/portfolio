import { RenderConfig } from "../../render/RenderConfig";
import { Slider } from "./Slider";
import Color4 from "three/src/renderers/common/Color4.js";

//-------------------------------
//          VideoProgressBar 
//-------------------------------

export class VideoProgressBar extends Slider {
    color: Color4 = new Color4("white");
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
        super(x, y, w, h, "pixel", undefined, undefined, "right", "middle");
        this.setSize(w, h, "pixel");
        this.applyAlignment();

        this.knobW = this.w - this.knobPadding * 2;
        this.trackSize = this.h - this.knobPadding * 2;

        this.knobH =
            (RenderConfig.gridSize.y * this.trackSize) / this.pageHeight;

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
            (RenderConfig.gridSize.y * this.trackSize) / this.pageHeight;
    }

    updateScrollOffset(value: number) {
        this.scrollOffset = value;

        this.knobPosition = (this.scrollOffset * this.trackSize) / this.pageHeight
    }

   

    draw(
        _ui: CanvasRenderingContext2D,
        background: CanvasRenderingContext2D,
    ): void {
        // Draw container
        background.fillStyle = "white";
        this.drawBackgroundRect(
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
        this.drawBackgroundRect(
            this.x + this.knobPadding ,
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
