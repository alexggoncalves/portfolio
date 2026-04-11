import { Color, Vector2 } from "three";
import Color4 from "three/src/renderers/common/Color4.js";

import { InteractiveElement } from "../core/InteractiveElement";

//------------------------------------------
// Button Class
//------------------------------------------

export class Button extends InteractiveElement {
    icon: HTMLImageElement;
    callback: () => void; // Button's function

    name: string = "play";

    constructor(
        iconSrc: string,
        callback: () => void,
        position: Vector2,
        w: number,
        h: number,
        color?: Color,
        backgroundColor?: Color4,

        resetCursorOnClick?: boolean,
        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom",
    ) {
        super(position, color, backgroundColor, horizontalAlign, verticalAlign);
        this.setPosition(position.x, position.y, "pixel");
        this.setSize(w, h, "pixel");

        this.isInteractive = true;
        this.hasPointerOnHover = true;
        this.callback = callback;

        this.icon = new Image();
        this.icon.crossOrigin = "anonymous";
        this.icon.src = iconSrc;
        this.icon.onload = () => {
            // this.loaded = true;
        };

        this.applyAlignment();

        if (resetCursorOnClick != undefined)
            this.resetCursorOnClick = resetCursorOnClick;
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
        context.strokeRect(
            this.pixelPosition.x,
            this.pixelPosition.y - this.pixelOffset.y,
            this.pixelSize.x,
            this.pixelSize.y,
        );
    }

    // update(): void {
    //     super.update();
    // }

    draw(
        _ui: CanvasRenderingContext2D,
        background: CanvasRenderingContext2D,
    ): void {
        if (this.icon) {
            background.drawImage(
                this.icon,
                this.pixelPosition.x,
                this.pixelPosition.y - this.pixelOffset.y,
                this.pixelSize.x,
                this.pixelSize.y,
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
        if (this.icon) {
            this.icon.onload = null;
            this.icon.src = "";
        }
        this.icon = null as any;
        this.callback = undefined as any;

        super.destroy()
    }
}
