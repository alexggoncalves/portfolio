import { Element, type Unit } from "../core/Element";
import { images } from "../../app/assetRecords";

//------------------------------------------
// Ascii Image Class
//------------------------------------------

export class CanvasImage extends Element {
    image: HTMLImageElement | null = null; // Image to draw

    src: string;
    loaded = false;
    radius: number;

    private clipPath?: Path2D;

    constructor(
        src: string,
        x: number,
        y:number,
        w: number, // width in ascii cells
        h: number, // height in ascii cells
        radius: number = 0,
        unit: Unit = "grid",
        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom",
    ) {
        super(x,y, unit, undefined, undefined, horizontalAlign, verticalAlign);
        this.isScrollable = true;
        this.setSize(w, h, unit);

        this.radius = radius;

        this.src = src;
        this.resolveImage();
    }

    private resolveImage() {
        const record = images.get(this.src);

        if (record) {
            this.image = record.element;
            this.loaded = record.loaded;
            return;
        }
        this.loaded = false;
    }

    draw(
        _asciiCtx: CanvasRenderingContext2D,
        bgCtx: CanvasRenderingContext2D,
    ): void {

        

        bgCtx.save();
        bgCtx.translate(- this.offsetX, - this.offsetY);

        if (this.radius > 0) {
            bgCtx.clip(this.getClipPath());
        }

        if (this.loaded && this.image) {
            bgCtx.drawImage(
                this.image,
                this.x,
                this.y,
                this.w,
                this.h,
            );
        } else this.drawPlaceholder(bgCtx);

        bgCtx.restore();
    }

    private drawPlaceholder(bgCtx: CanvasRenderingContext2D): void {
        bgCtx.fillStyle = "#595959";

        // Draw image to "background" canvas
        bgCtx.fillRect(
            this.x,
            this.y,
            this.w,
            this.h,
        );
    }

    private getClipPath() {
        if (this.clipPath) return this.clipPath;

        const x = this.x;
        const y = this.y;
        const width = this.w;
        const height = this.h;

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
        this.image = null;
        this.clipPath = undefined;

        super.destroy();
    }
}
