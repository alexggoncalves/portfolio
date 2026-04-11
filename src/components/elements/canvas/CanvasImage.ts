import { Vector2 } from "three";
import { Element } from "../core/Element";

//------------------------------------------
// Ascii Image Class
//------------------------------------------

export class CanvasImage extends Element {
    image: HTMLImageElement; // Image to draw

    loaded = false;
    radius: number;

    private clipPath?: Path2D;

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
        this.setSize(width, height, "grid");
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
        bgCtx.translate(-this.pixelOffset.x, -this.pixelOffset.y);

        if (this.radius > 0) {
            bgCtx.clip(this.getClipPath());
        }

        if (!this.loaded) {
            this.drawPlaceholder(bgCtx);
        } else {
            this.drawImage(bgCtx);
        }

        bgCtx.restore();
    }

    private drawImage(bgCtx: CanvasRenderingContext2D): void {
        // Draw image to "background" canvas
        bgCtx.drawImage(
            this.image,
            this.pixelPosition.x,
            this.pixelPosition.y,
            this.pixelSize.x,
            this.pixelSize.y,
        );
    }

    private drawPlaceholder(bgCtx: CanvasRenderingContext2D): void {
        bgCtx.fillStyle = "#595959";

        // Draw image to "background" canvas
        bgCtx.fillRect(
            this.pixelPosition.x,
            this.pixelPosition.y,
            this.pixelSize.x,
            this.pixelSize.y,
        );
    }

    private getClipPath() {
        if (this.clipPath) return this.clipPath;

        const x = this.pixelPosition.x;
        const y = this.pixelPosition.y;
        const width = this.pixelSize.x;
        const height = this.pixelSize.y;

        const path = new Path2D();
        path.moveTo(x + this.radius, y);
        path.lineTo(x + width - this.radius, y);
        path.quadraticCurveTo(x + width, y, x + width, y + this.radius);
        path.lineTo(x + width, y + height - this.radius);
        path.quadraticCurveTo(
            x + width,
            y + height,
            x + width - this.radius,
            y + height,
        );
        path.lineTo(x + this.radius, y + height);
        path.quadraticCurveTo(x, y + height, x, y + height - this.radius);
        path.lineTo(x, y + this.radius);
        path.quadraticCurveTo(x, y, x + this.radius, y);

        this.clipPath = path;
        return path;
    }

    destroy(): void {
        // Remove references to image
        this.image.onload = null;
        this.image.src = "";
        this.image = null as any;
        this.clipPath = undefined;

        super.destroy();
    }
}
