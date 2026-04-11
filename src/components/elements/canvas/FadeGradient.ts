import { Vector2 } from "three";

import { Element } from "../core/Element";
import type Color4 from "three/src/renderers/common/Color4.js";

//------------------------------------------
// Fade Gradient Class
//------------------------------------------

export class FadeGradient extends Element {
    gradient: CanvasGradient | null;
    direction: "top" | "bottom" | "left" | "right";

    constructor(
        color: Color4,
        position: Vector2,
        size: Vector2,
        direction: "top" | "bottom" | "left" | "right",
        sizeUnit: "grid" | "pixel" = "grid",
    ) {
        super(position, undefined, color);

        this.direction = direction;
        this.gradient = null;
        this.setSize(size.x, size.y, sizeUnit);
        this.isScrollable = false;
    }

    draw(
        _asciiCtx: CanvasRenderingContext2D,
        bgCtx: CanvasRenderingContext2D,
    ): void {
        const x = this.pixelPosition.x;
        const y = this.pixelPosition.y;
        const w = this.pixelSize.x;
        const h = this.pixelSize.y;

        const r = this.backgroundColor.r * 255;
        const g = this.backgroundColor.g * 255;
        const b = this.backgroundColor.b * 255;

        if (!this.gradient) {
            if (this.direction === "top") {
                this.gradient = bgCtx.createLinearGradient(x, y, x, y + h);
                this.gradient.addColorStop(0, `rgba(${r},${g},${b},0.95)`);
                this.gradient.addColorStop(0.7, `rgba(${r},${g},${b},0.40)`);
                this.gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
            } else if (this.direction === "bottom") {
                this.gradient = bgCtx.createLinearGradient(x, y - h, x, y);
                this.gradient.addColorStop(0, `rgba(${r},${g},${b},0)`);
                this.gradient.addColorStop(1, `rgba(${r},${g},${b},1)`);
            } else if (this.direction === "left") {
                this.gradient = bgCtx.createLinearGradient(x, y, x + w, y);
                this.gradient.addColorStop(0, `rgba(${r},${g},${b},1)`);
                this.gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
            } else if (this.direction === "right") {
                this.gradient = bgCtx.createLinearGradient(x, y, x + w, y);
                this.gradient.addColorStop(0, `rgba(${r},${g},${b},0)`);
                this.gradient.addColorStop(1, `rgba(${r},${g},${b},1)`);
            }
        }

        if (this.gradient === null) return;

        // Draw gradient
        bgCtx.fillStyle = this.gradient;

        if (this.direction === "top") {
            bgCtx.fillRect(x, y, w, h);
        } else if (this.direction === "bottom") {
            bgCtx.fillRect(x, y - h, w, h);
        } else if (this.direction === "left" || "right") {
            bgCtx.fillRect(x, this.pixelPosition.y - this.pixelOffset.y, w, h);
        }
    }
}
