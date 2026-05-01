import { Color } from "three";
import { Element, type Unit } from "../core/Element";

function parseRGB(color: string) {
    const match = color.match(/rgba?\(([^)]+)\)/);

    if (!match) {
        const c = new Color(color);
        return {
            r: c.r * 255,
            g: c.g * 255,
            b: c.b * 255,
        };
    }

    const [r, g, b] = match[1]
        .split(",")
        .map(v => parseFloat(v.trim()));

    return { r, g, b };
}

//------------------------------------------
// Fade Gradient Class
//------------------------------------------

export class FadeGradient extends Element {
    gradient: CanvasGradient | null;
    direction: "top" | "bottom" | "left" | "right";

    r: number;
    g: number;
    b: number;

    constructor(
        color: string,
        x: number,
        y: number,
        w: number,
        h: number,
        direction: "top" | "bottom" | "left" | "right",
        unit: Unit = "grid",
    ) {
        super(x, y, unit, color);
        this.setSize(w, h, unit);

        const c = parseRGB(color);
        this.r = c.r;
        this.g = c.g;
        this.b = c.b;

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

        if (!this.gradient) {
            const r = this.r;
            const g = this.g;
            const b = this.b;

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
        } else if (this.direction === "left" || this.direction === "right") {
            bgCtx.fillRect(x, this.y - this.offsetY, w, h);
        }
    }

    destroy(): void {
        this.gradient = null;
    }
}
