import { Color } from "three";
import Color4 from "three/src/renderers/common/Color4.js";

import { InteractiveElement } from "../core/InteractiveElement";
import type { Unit } from "../core/Element";

//------------------------------------------
// Button Class
//------------------------------------------

export class Slider extends InteractiveElement {
    direction: "horizontal" | "vertical" = "vertical";

    trackSize: number = 0;
    dragStartX: number = 0;
    dragLastX: number = 0;
    isMouseDown: boolean = false;

    velocity: number = 0;
    decay: number = 0.95;
    // isMouseDown: boolean = false;

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

    onPointerDown(y: number) {
        this.isMouseDown = true;
        this.dragStartX = y;
        this.dragLastX = y;
        this.velocity = 0;
    }

    onPointerUp() {
        this.isMouseDown = false;
    }

    onPointerMove(y: number) {
        if (!this.isMouseDown) return;

        const delta = y - this.dragLastX;
        this.dragLastX = y;

        this.velocity = delta;
    }

    destroy(): void {
        super.destroy();
    }
}
