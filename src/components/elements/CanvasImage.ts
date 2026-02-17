import { Vector2 } from "three";
import { Element } from "./Element";

//------------------------------------------
// Ascii Image Class
//------------------------------------------

export class CanvasImage extends Element {
    image: HTMLImageElement; // Image to draw
    imageSize: Vector2 = new Vector2(0, 0);

    loaded = false;
    radius: number;

    constructor(
        src: string,
        position: Vector2,
        width: number, // width in ascii cells
        height: number, // height in ascii cells
        radius: number = 0,
        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom",
    ) {
        super(position, undefined, undefined, horizontalAlign, verticalAlign);
        this.isScrollable = true;
        this.setSize(width, height);
        this.applyAlignment();

        this.radius = radius;

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

        bgCtx.save();
        if (this.radius > 0) {
            this.createClippingMask(bgCtx);
            bgCtx.clip();
        }

        if (!this.loaded) {
            this.drawPlaceholder(bgCtx);
        } else {
            this.drawImage(bgCtx);
        }

        bgCtx.restore();
    }

    private drawImage(bgCtx: CanvasRenderingContext2D): void {
        bgCtx.globalAlpha = this.opacity;

        // Draw image to "background" canvas
        bgCtx.drawImage(
            this.image,
            0,
            0,
            this.image.width,
            this.image.height,
            this.pixelPosition.x,
            this.pixelPosition.y - this.pixelOffset.y,
            this.pixelSize.x,
            this.pixelSize.y,
        );
    }

    private drawPlaceholder(bgCtx: CanvasRenderingContext2D): void {
        bgCtx.globalAlpha = this.opacity;
        bgCtx.fillStyle = "#595959";

        // Draw image to "background" canvas
        bgCtx.fillRect(
            this.pixelPosition.x,
            this.pixelPosition.y - this.pixelOffset.y,
            this.pixelSize.x,
            this.pixelSize.y,
        );
    }

    private createClippingMask(bgCtx: CanvasRenderingContext2D) {
        const x = this.pixelPosition.x;
        const y = this.pixelPosition.y - this.pixelOffset.y;
        const width = this.pixelSize.x;
        const height = this.pixelSize.y;

        bgCtx.globalAlpha = 1;
        bgCtx.beginPath();
        bgCtx.moveTo(x + this.radius, y);
        bgCtx.lineTo(x + width - this.radius, y);
        bgCtx.quadraticCurveTo(x + width, y, x + width, y + this.radius);
        bgCtx.lineTo(x + width, y + height - this.radius);
        bgCtx.quadraticCurveTo(
            x + width,
            y + height,
            x + width - this.radius,
            y + height,
        );
        bgCtx.lineTo(x + this.radius, y + height);
        bgCtx.quadraticCurveTo(x, y + height, x, y + height - this.radius);
        bgCtx.lineTo(x, y + this.radius);
        bgCtx.quadraticCurveTo(x, y, x + this.radius, y);
        bgCtx.closePath();
    }
}
