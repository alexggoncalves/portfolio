import { Element, type Unit } from "../core/Element";
import type Color4 from "three/src/renderers/common/Color4.js";

//------------------------------------------
// Fade Gradient Class
//------------------------------------------

export class FadeGradient extends Element {
    gradient: CanvasGradient | null;
    direction: "top" | "bottom" | "left" | "right";

    constructor(
        color: Color4,
        x: number,
        y: number,
        w: number,
        h: number,
        direction: "top" | "bottom" | "left" | "right",
        unit: Unit = "grid",
    ) {
        super(x,y,unit, undefined, color);
        this.setSize(w, h, unit);

        this.direction = direction;
        this.gradient = null;
        this.isScrollable = false;
    }

    draw(
        _asciiCtx: CanvasRenderingContext2D,
        bgCtx: CanvasRenderingContext2D,
    ): void {
        const x = this.x;
        const y = this.y;
        const w = this.w;
        const h = this.h;

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
            bgCtx.fillRect(x, this.y - this.offsetY, w, h);
        }
    }

    destroy(): void {
        this.gradient = undefined as any;
    }
}
