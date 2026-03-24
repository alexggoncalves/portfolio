import { Color, Vector2 } from "three";
import Color4 from "three/src/renderers/common/Color4.js";

import useCursorStore from "../../stores/cursorStore";
import { InteractiveElement } from "./InteractiveElement";

//------------------------------------------
// Button Class
//------------------------------------------

export class ASCIIButton extends InteractiveElement {
    text: string = ""; // Text to display on button
    callback: () => void; // Button's function
    resetCursorOnClick: boolean = true;

    isCursorPointer = false;

    constructor(
        text: string,
        callback: () => void,
        position: Vector2,
        color: Color,
        backgroundColor: Color4,

        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom",
        size?: Vector2,
        resetCursorOnClick?: boolean,
    ) {
        super(position, color, backgroundColor, horizontalAlign, verticalAlign);

        this.text = text;
        this.isInteractive = true;
        this.callback = callback;

        if (!size) {
            this.setSize(this.text);
        } else this.setSize(size.x, size.y);

        this.applyAlignment();

        if (resetCursorOnClick != undefined) this.resetCursorOnClick = resetCursorOnClick;

    }

    drawButtonFrame(
        strokeWeight: number,
        color: Color4,
        context: CanvasRenderingContext2D,
    ): void {
        // Set color and stroke
        context.strokeStyle = `rgba(${color.r * 255},
        ${color.g * 255},
        ${color.b * 255},
        ${color.a * this.opacity})`;
        context.lineWidth = strokeWeight;

        // Draw frame
        context.strokeRect(this.pixelPosition.x, this.pixelPosition.y, this.pixelSize.x, this.pixelSize.y);
    }

    update(): void {
        const mouseEnter = useCursorStore.getState().mouseEnter;
        const mouseLeave = useCursorStore.getState().mouseLeave;

        if(this.isMouseOver && !this.isCursorPointer){
            mouseEnter();
            this.isCursorPointer = true;
        }
        else if(!this.isMouseOver && this.isCursorPointer){
            mouseLeave();
            this.isCursorPointer = false;
        }
    }

    draw(
        ui: CanvasRenderingContext2D,
        background: CanvasRenderingContext2D,
    ): void {
        this.drawBlock(this.text, ui, background);

        if (this.isMouseOver) {
            this.drawButtonFrame(2, new Color4(...this.color, 1), background);
        }
    }

    onClick(): void {
        if (this.callback) this.callback();

        if (this.resetCursorOnClick) {
            const mouseLeave = useCursorStore.getState().mouseLeave;
            mouseLeave();
        }
    }
}
