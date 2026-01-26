import { Color, Vector2 } from "three";
import useAsciiStore from "../../../stores/asciiStore";
import Color4 from "three/src/renderers/common/Color4.js";

import { Element } from "./Element";

//------------------------------------------
// Button Class
//------------------------------------------

export class Cursor {
    position: Vector2;
    state: "pointer" | "default";

    constructor() {
        this.position = new Vector2(0, 0);

        this.state = "pointer";
    }

    draw(
        ui: CanvasRenderingContext2D,
        background: CanvasRenderingContext2D,
    ): void {
        const canvasOffset = useAsciiStore.getState().canvasOffset;
        background.beginPath();
        background.ellipse(
            this.position.x + canvasOffset.x,
            this.position.y + canvasOffset.y,
            10,
            10,
            0,
            0,
            2 * Math.PI,
        );
        background.fillStyle = this.state === "pointer" ? "#FF0000" : "#FFFFFF50";
        background.fill();
        background.restore();
    }

    update(
        ui: CanvasRenderingContext2D,
        background: CanvasRenderingContext2D,
        position: { x: number; y: number },
        state: "pointer" | "default",
    ): void {
        this.position.set(position.x, position.y);

        this.state = state;

        this.draw(ui, background);
    }
}
