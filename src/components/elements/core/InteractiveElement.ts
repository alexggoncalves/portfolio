import { Color } from "three";
import Color4 from "three/src/renderers/common/Color4.js";
import { Element, type Unit } from "./Element";

//-----------------------------------------
// ELEMENT CLASS
//-----------------------------------------
export class InteractiveElement extends Element {
    zIndex: number = 0;
    active: boolean = true;

    isMouseOver: boolean = false;

    hasPointerOnHover: boolean = true;

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
    }

    contains(x: number,y: number): boolean {
        const minX = this.x - this.offsetX;
        const maxX = minX + this.w;

        const minY = this.y - this.offsetY;
        const maxY = minY + this.h;

        return x >= minX && x <= maxX && y >= minY && y <= maxY;
    }

    onClick() {
    }

    update() {
    }

    destroy(): void {
        this.isMouseOver = false;
        this.active = false;

        super.destroy?.();
    }
}
