import { Color, Vector2 } from "three";
import Color4 from "three/src/renderers/common/Color4.js";
import { Element } from "./Element";
import usePointerStore from "../../../stores/pointerStore";

//-----------------------------------------
// ELEMENT CLASS
//-----------------------------------------
export class InteractiveElement extends Element {
    zIndex: number = 0;
    active: boolean = true;

    isMouseOver: boolean = false;
    resetCursorOnClick: boolean = true;

    hasPointerOnHover: boolean = true;

    isCursorPointer = false;

    mouseEnter: () => void;
    mouseLeave: () => void;

    constructor(
        position: Vector2,
        color?: Color,
        backgroundColor?: Color4,
        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom",
    ) {
        super(position, color, backgroundColor, horizontalAlign, verticalAlign);

        this.isInteractive = true;

        this.mouseEnter = usePointerStore.getState().mouseEnter;
        this.mouseLeave = usePointerStore.getState().mouseLeave;
    }

    contains(pos: Vector2): boolean {
        const minX = this.pixelPosition.x - this.pixelOffset.x;
        const maxX = minX + this.pixelSize.x;

        const minY = this.pixelPosition.y - this.pixelOffset.y;
        const maxY = minY + this.pixelSize.y;

        return pos.x >= minX && pos.x <= maxX && pos.y >= minY && pos.y <= maxY;
    }
    onClick() {
        if (this.resetCursorOnClick) {
            this.mouseLeave();
        }
    }

    update() {
        // if (this.hasPointerOnHover) {
        if (this.isMouseOver && !this.isCursorPointer) {
            this.mouseEnter();
            this.isCursorPointer = true;
        } else if (!this.isMouseOver && this.isCursorPointer) {
            this.mouseLeave();
            this.isCursorPointer = false;
        }
    }

    destroy(): void {
        this.isMouseOver = false;
        this.isCursorPointer = false;
        this.active = false;

        // force cursor reset if this element was still active
        this.mouseLeave?.();

        this.mouseEnter = undefined as any;
        this.mouseLeave = undefined as any;

        super.destroy?.();
    }
}
