import { Vector2 } from "three";
// import useAsciiStore from "../../stores/asciiStore";

//------------------------------------------
// Cursor Class
//------------------------------------------

export class Cursor {
    position: Vector2;
    state: "pointer" | "default";

    constructor() {
        this.position = new Vector2(0, 0);

        this.state = "pointer";
    }

    draw(
        _asciiCtx: CanvasRenderingContext2D,
        bgCtx: CanvasRenderingContext2D,
    ): void {
        // const canvasOffset = useAsciiStore.getState().canvasOffset;
        bgCtx.beginPath();
        bgCtx.ellipse(
            this.position.x-5,
            this.position.y-5 ,
            10,
            10,
            0,
            0,
            2 * Math.PI,
        );
        bgCtx.fillStyle = this.state === "pointer" ? "#FF0000" : "#FFFFFF50";
        bgCtx.fill();
        bgCtx.restore();
    }

    update(
        asciiCtx: CanvasRenderingContext2D,
        bgCtx: CanvasRenderingContext2D,
        position: { x: number; y: number },
        state: "pointer" | "default",
    ): void {
        this.position.set(position.x, position.y);

        this.state = state;

        this.draw(asciiCtx, bgCtx);
    }
}
