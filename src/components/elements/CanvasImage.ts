import { Vector2 } from "three";
import useAsciiStore from "../../stores/asciiStore";

import { Element } from "./Element";



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
        this.isScrollable = true;
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
        _asciiCtx: CanvasRenderingContext2D,
        bgCtx: CanvasRenderingContext2D,
    ): void {
        if (!this.image) return;

        if (!this.loaded) {
            this.drawPlaceholder(bgCtx);
        } else {
            this.drawImage(bgCtx);
        }
    }

    private drawImage(bgCtx: CanvasRenderingContext2D): void {
        const charSize = useAsciiStore.getState().charSize;
       
        bgCtx.save();
        bgCtx.globalAlpha = this.opacity;

        // Draw image to "background" canvas
        bgCtx.drawImage(
            this.image,
            0,
            0,
            this.image.width,
            this.image.height,
            this.position.x * charSize.x,
            (this.position.y - this.offset.y) * charSize.y,
            this.size.x * charSize.x,
            this.size.y * charSize.y,
        );
        bgCtx.restore();
    }

    private drawPlaceholder(bgCtx: CanvasRenderingContext2D): void {
        const charSize = useAsciiStore.getState().charSize;
        
        bgCtx.save();
        bgCtx.globalAlpha = this.opacity;
        bgCtx.fillStyle = "#595959";

        // Draw image to "background" canvas
        bgCtx.fillRect(
            this.position.x * charSize.x,
            (this.position.y - this.offset.y) * charSize.y ,
            this.size.x * charSize.x,
            this.size.y * charSize.y,
        );
        bgCtx.restore();
    }
}
