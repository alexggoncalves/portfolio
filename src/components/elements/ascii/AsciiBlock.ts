import { getAsciiBitmap } from "../../assets/asciiBlocks";
import { Element } from "../core/Element";

//-----------------------------------------
// Ascii Block Class
//-----------------------------------------
export class AsciiBlock extends Element {
    bitmap: ImageBitmap | null;

    backgroundColor: string | null = null;

    constructor(
        bitmapId: string,
        x: number,
        y: number,
        color: string,
        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom",
    ) {
        super(x, y, "grid", color, horizontalAlign, verticalAlign);

        const bitmap = getAsciiBitmap(bitmapId);
        this.bitmap = bitmap;

        if (bitmap) {
            this.setSize(bitmap.width, bitmap.height, "grid");
        } else this.setSize(1, 1, "grid");

        this.applyAlignment();
    }

    draw(
        asciiCtx: CanvasRenderingContext2D,
        _bgCtx: CanvasRenderingContext2D,
    ): void {
        if (!this.bitmap) return;
        
        AsciiBlock.drawBlock(
            this.bitmap,
            this.gridX,
            this.gridY,
            asciiCtx,
            this.opacity,
        );
    }
}
