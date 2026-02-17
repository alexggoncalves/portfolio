import { Vector2 } from "three";

import { Element } from "./Element";
import type Color4 from "three/src/renderers/common/Color4.js";

//------------------------------------------
// Gradient Strip Class
//------------------------------------------

export class FadeGradient extends Element {
    gradient: CanvasGradient | null;
    direction: "top" | "bottom";

    constructor(
        color: Color4,
        position: Vector2,
        size: Vector2,
        direction: "top" | "bottom",
    ) {
        super(position, undefined, color);

        this.direction = direction;
        this.gradient = null;
        this.setSize(size.x, size.y);
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

        // if (!this.gradient) {
            if (this.direction === "top") {
                this.gradient = bgCtx.createLinearGradient(x, y, x, y + h);
                this.gradient.addColorStop(0, `rgba(${r},${g},${b},0.95)`);
                this.gradient.addColorStop(0.7, `rgba(${r},${g},${b},0.40)`);
                this.gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
                
            } else {
                this.gradient = bgCtx.createLinearGradient(x, y - h, x, y);
                this.gradient.addColorStop(0, `rgba(${r},${g},${b},0)`);
                this.gradient.addColorStop(1, `rgba(${r},${g},${b},1)`);
            }
        // }

        bgCtx.save();

        // Draw gradient
        bgCtx.fillStyle = this.gradient;
        bgCtx.globalAlpha = this.opacity;

        if (this.direction === "top") {
            bgCtx.fillRect(x, y, w, h);
        } else {
            bgCtx.fillRect(x, y - h, w, h);
        }

        bgCtx.restore();
    }
}
