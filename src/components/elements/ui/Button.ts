import { Color } from "three";
import Color4 from "three/src/renderers/common/Color4.js";

import { InteractiveElement } from "../core/InteractiveElement";
import type { Unit } from "../core/Element";
import { images } from "../../app/assetRecords";

//------------------------------------------
// Button Class
//------------------------------------------

export class Button extends InteractiveElement {
    icon: HTMLImageElement | null = null;
    iconSrc: string;
    loaded: boolean = false;

    callback: () => void; // Button's function

    name: string = "play";

    constructor(
        iconSrc: string,
        callback: () => void,
        x: number,
        y: number,
        w: number,
        h: number,
        unit: Unit,
        color?: Color,
        backgroundColor?: Color4,
        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom",
    ) {
        super(
            x,
            y,
            unit,
            color,
            backgroundColor,
            horizontalAlign,
            verticalAlign,
        );
        this.setSize(w, h, unit);
        this.applyAlignment();
        this.iconSrc = iconSrc;

        this.isInteractive = true;
        this.hasPointerOnHover = true;
        this.callback = callback;

        this.resolveImage();
    }

    private resolveImage() {
        const record = images.get(this.iconSrc);

        if (record) {
            this.icon = record.element;
            this.loaded = record.loaded;
            return;
        }
        this.loaded = false;
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
        context.strokeRect(this.x, this.y - this.offsetY, this.w, this.h);
    }

    // update(): void {
    //     super.update();
    // }

    draw(
        _ui: CanvasRenderingContext2D,
        background: CanvasRenderingContext2D,
    ): void {
        const record = images.get(this.iconSrc);

        if (record?.loaded && !this.loaded) {
            this.icon = record.element;
            this.loaded = true;
        }

        if (this.loaded && this.icon) {
            background.drawImage(
                this.icon,
                this.x,
                this.y - this.offsetY,
                this.w,
                this.h,
            );
        }

        if (this.isMouseOver) {
            this.drawButtonFrame(2, background);
        }
    }

    onClick(): void {
        super.onClick();
        if (this.callback) this.callback();
    }

    destroy(): void {
        this.icon = null;

        super.destroy();
    }
}
