import { Color, Vector2 } from "three";

import { Element } from "./Element";
import useAsciiStore from "../../../stores/asciiStore";

//------------------------------------------
// Gradient Strip Class
//------------------------------------------

export class FadeGradient extends Element {
    gradient: CanvasGradient | null;
    direction: "top" | "bottom";

    constructor(
        color: Color,
        position: Vector2,
        size: Vector2,
        direction: "top" | "bottom"
    ) {
        super(position, color);

        this.direction = direction;
        this.gradient = null;
        this.setSize(size.x, size.y);
    }

    draw(
        _ui: CanvasRenderingContext2D,
        background: CanvasRenderingContext2D
    ): void {
        const charSize = useAsciiStore.getState().charSize;

        const x = this.position.x * charSize.x;
        const y = this.position.y * charSize.y;
        const w = this.size.x * charSize.x;
        const h = this.size.y * charSize.y;

        const r = this.color.r * 255;
        const g = this.color.g * 255;
        const b = this.color.b * 255;

        if (!this.gradient) {
            if (this.direction === "top") {
                this.gradient = background.createLinearGradient(x, y, x, y + h);
                this.gradient.addColorStop(0, `rgba(${r},${g},${b},1)`);
                this.gradient.addColorStop(0.3, `rgba(${r},${g},${b},0.8`);
                this.gradient.addColorStop(0.7, `rgba(${r},${g},${b},0.4`);
                this.gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
            } else {
                this.gradient = background.createLinearGradient(x, y - h, x, y);
                this.gradient.addColorStop(0, `rgba(${r},${g},${b},0)`);
                this.gradient.addColorStop(1, `rgba(${r},${g},${b},1)`);
            }
        }
        // Draw gradient
        background.fillStyle = this.gradient;

        if (this.direction === "top") {
            background.fillRect(x, y, w, h);
        } else {
            background.fillRect(x, y - h, w, y);
        }

        // Draw extended occlusion area
        background.fillStyle = `rgba(${r},${g},${b},1)`;

        if (this.direction === "top") {
            background.fillRect(x, y - 10 * charSize.y, w, 10 * charSize.y);
        } else {
            background.fillRect(x, y, w, 10 * charSize.y);
        }
    }

    update(): void {}
}
