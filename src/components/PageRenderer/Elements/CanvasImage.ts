import { Vector2 } from "three";
import useAsciiStore from "../../../stores/asciiStore";

import { Element } from "../Element";

const charSize = useAsciiStore.getState().charSize;

//------------------------------------------
// Ascii Image Class
//------------------------------------------

export class CanvasImage extends Element {
    image: HTMLImageElement; // Image to draw
    imageSize: Vector2 = new Vector2(0, 0);

    loaded = false;

    constructor(
        src: string,
        position: Vector2,
        width: number, // width in ascii cells
        height: number, // height in ascii cells
        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom",
    ) {
        super(position, undefined, undefined, horizontalAlign, verticalAlign);
        this.animated = true;
        this.interactive = true;
        this.setSize(width, height);
        this.applyAlignment();

        this.image = new Image();
        this.image.crossOrigin = "anonymous";
        this.image.src = src;
        this.image.onload = () => {
            this.loaded = true;
        };
    }

    draw(
        _ui: CanvasRenderingContext2D,
        background: CanvasRenderingContext2D,
    ): void {
        if (!this.image) return;

        if (!this.loaded) {
            this.drawPlaceholder(background);
        } else {
            this.drawImage(background);
        }
    }

    private drawImage(background: CanvasRenderingContext2D): void {
        background.save();
        background.globalAlpha = this.opacity;

        // Draw image to "background" canvas
        background.drawImage(
            this.image,
            0,
            0,
            this.image.width,
            this.image.height,
            this.position.x * charSize.x,
            (this.position.y - this.yOffset) * charSize.y,
            this.size.x * charSize.x,
            this.size.y * charSize.y,
        );
        background.restore();
    }

    private drawPlaceholder(background: CanvasRenderingContext2D): void {
        background.save();
        background.globalAlpha = this.opacity;
        background.fillStyle = "#595959";

        // Draw image to "background" canvas
        background.fillRect(
            this.position.x * charSize.x,
            (this.position.y - this.yOffset) * charSize.y ,
            this.size.x * charSize.x,
            this.size.y * charSize.y,
        );
        background.restore();
    }
}
