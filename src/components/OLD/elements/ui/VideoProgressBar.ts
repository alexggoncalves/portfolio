import { Element } from "../core/Element";
import { Slider } from "./Slider";
//-------------------------------
//          VideoProgressBar
//-------------------------------

export class VideoProgressBar extends Slider {
    // color: Color4 = new Color4("white");
    cornerRadius: number;
    // Dragging state
    mouseX: number = -1;
    mouseY: number = -1;

    knobPadding: number = 4;
    knobW: number = 6;
    knobH: number = 14;
    knobOffset: number = 0;

    currentTime: number = 0;
    totalTime: number = 0;

    constructor(
        x: number,
        y: number,
        w: number,
        h: number,
        cornerRadius: number,
    ) {
        super(x, y, w, h, "pixel", undefined, "left", "top");
        this.setSize(w, h, "pixel");

        this.cornerRadius = cornerRadius;

        // Scroll values
        this.isScrollable = true;
    }

    // update(_delta: number, yOffset: number): void {
    //     super.update(_delta, yOffset);
    // }

    updateTime(value: number) {
        this.currentTime = value;
        this.knobOffset = (this.currentTime / this.totalTime) * this.w;
    }

    setTotalTime(value: number) {
        this.totalTime = value;
    }

    draw(
        _ui: CanvasRenderingContext2D,
        background: CanvasRenderingContext2D,
    ): void {
        // Draw container
        Element.drawRect(
            this.x,
            this.y - this.offsetY,
            this.w,
            this.h,
            this.h / 2,
            false,
            this.color,
            background,
        );

        // Draw Knob
        Element.drawRect(
            this.x + this.knobOffset,
            this.y - this.offsetY + this.h / 2 - this.knobH / 2,
            this.knobW,
            this.knobH,
            this.knobW / 4,
            false,
            "green",
            background,
        );
    }

    destroy(): void {
        super.destroy();
    }
}
