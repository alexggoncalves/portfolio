import { Vector2 } from "three";
import useAsciiStore from "../../../stores/asciiStore";

import { Element } from "./Element";

//------------------------------------------
// Ascii Image Class
//------------------------------------------

export class CanvasImage extends Element {
    image: HTMLImageElement; // Image to draw
    imageSize: Vector2;

    renderAscii: boolean;

    currentOpacity: number = 1; // 0 = fully UI , 1 = fully background
    targetOpacity: number = 0;
    startOpacity: number = 1;
    fadeTimer: number = 0;
    fadeDuration: number = 1;

    yOffset = 0;

    constructor(
        image: HTMLImageElement,
        position: Vector2,
        width: number, // width in ascii cells
        height: number, // height in ascii cells
        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom",
        renderAscii: boolean = false
    ) {
        super(position, undefined, undefined, horizontalAlign, verticalAlign);
        this.image = image;
        this.renderAscii = renderAscii;

        this.animated = true;
        this.interactive = true;

        this.imageSize = new Vector2(this.image.width, this.image.height);

        this.setSize(width, height);
        this.applyAlignment();
    }

    draw(
        _ui: CanvasRenderingContext2D,
        background: CanvasRenderingContext2D
    ): void {
        if (!this.image) {
            return;
        }
        this.drawImage(background);
    }

    private drawImage(background: CanvasRenderingContext2D): void {
        const charSize = useAsciiStore.getState().charSize;

        // Draw background (full picture)
        background.save();
        background.globalAlpha = this.opacity;
        
        background.drawImage(
            this.image,
            0,
            0,
            800,
            600,
            this.position.x * charSize.x,
            this.position.y * charSize.y - this.yOffset,
            this.size.x * charSize.x,
            this.size.y * charSize.y
        );

        // Restore global alpha
        background.restore();
    }

    easeInOutSine(t: number): number {
        t = Math.max(0, Math.min(1, t));
        return -(Math.cos(Math.PI * t) - 1) / 2;
    }

    setYOffset(y:number):void {
        this.yOffset = y
    }

    update(delta: number): void {
        if (this.currentOpacity === this.targetOpacity) return;

        // Increment timer
        this.fadeTimer += delta;
        const t = Math.min(this.fadeTimer / this.fadeDuration, 1); // normalized 0→1

        // Apply easing (ease in/out sine)
        const eased = this.easeInOutSine(t);

        // Interpolate from start to target
        this.currentOpacity =
            this.startOpacity +
            (this.targetOpacity - this.startOpacity) * eased;
    }
}
