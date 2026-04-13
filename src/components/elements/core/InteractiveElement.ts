import { Color, Vector2 } from "three";
import Color4 from "three/src/renderers/common/Color4.js";
import { Element, type Unit } from "./Element";
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
        x:number,
        y:number,
        unit: Unit = "pixel",
        color?: Color,
        backgroundColor?: Color4,
        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom",
    ) {
        super(x, y, unit, color, backgroundColor, horizontalAlign, verticalAlign);
        this.setSize(1,1,"pixel")
        this.isInteractive = true;

        this.mouseEnter = usePointerStore.getState().mouseEnter;
        this.mouseLeave = usePointerStore.getState().mouseLeave;
    }

    contains(x: number,y: number): boolean {
        const minX = this.x - this.offsetX;
        const maxX = minX + this.w;

        const minY = this.y - this.offsetY;
        const maxY = minY + this.h;

        return x >= minX && x <= maxX && y >= minY && y <= maxY;
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
