import { Color } from "three";
import Color4 from "three/src/renderers/common/Color4.js";

import { InteractiveElement } from "../core/InteractiveElement";
import type { Unit } from "../core/Element";

//------------------------------------------
// Button Class
//------------------------------------------

export class Slider extends InteractiveElement {
    
    trackSize: number = 0;
    dragStartX: number = 0;
    dragLastX: number = 0;
    isMouseDown: boolean = false;

    constructor(
        x: number,
        y: number,
        w: number,
        h: number,
        unit: Unit,
        color?: Color,
        backgroundColor?: Color4,
        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom",
    ) {
        super(
            x,
            y,
            unit,
            color,
            backgroundColor,
            horizontalAlign,
            verticalAlign,
        );
        this.setSize(w, h, unit);

        this.isInteractive = true;
        this.hasPointerOnHover = true;
        // this.callback = callback;
    }

    // update(): void {
    //     super.update();
    // }

    // draw(
    //     _ui: CanvasRenderingContext2D,
    //     background: CanvasRenderingContext2D,
    // ): void {

    // }

    onClick(): void {
        super.onClick();
        // if (this.callback) this.callback();
    }

    destroy(): void {
        super.destroy();
    }
}
