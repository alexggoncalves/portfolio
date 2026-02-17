import { Color, Vector2 } from "three";
import Color4 from "three/src/renderers/common/Color4.js";
import { Element } from "./Element";

//-----------------------------------------
// ELEMENT CLASS
//-----------------------------------------
export class InteractiveElement extends Element {
    zIndex: number = 0;

    isMouseOver: boolean = false;

    constructor(
        position: Vector2,
        color?: Color,
        backgroundColor?: Color4,
        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom",
    ) {
        super(position, color, backgroundColor, horizontalAlign, verticalAlign);

        this.isInteractive = true;
    }

    contains(pos: Vector2): boolean {
        return (
            pos.x < this.pixelPosition.x + this.pixelSize.x &&
            pos.x > this.pixelPosition.x &&
            pos.y <
                this.pixelPosition.y + this.pixelSize.y - this.pixelOffset.y &&
            pos.y > this.pixelPosition.y - this.pixelOffset.y
        );
    }

    onClick(){}

    update(){}
}
