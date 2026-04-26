import { Color } from "three";
import type Color4 from "three/src/renderers/common/Color4.js";
import { Element } from "../core/Element";
import { getAsciiBitmap } from "../../assets/asciiBlocks";

//-----------------------------------------
// Ascii Block Class
//-----------------------------------------
export class AsciiBlock extends Element {
    bitmap: ImageBitmap | null;

    constructor(
        bitmapId: string,
        x: number,
        y: number,
        color: Color,
        backgroundColor: Color4,
        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom",
    ) {
        super(
            x,
            y,
            "grid",
            color,
            backgroundColor,
            horizontalAlign,
            verticalAlign,
        );

        const bitmap = getAsciiBitmap(bitmapId);
        this.bitmap = bitmap;

        if(bitmap){
            this.setSize(bitmap?.width,bitmap?.height,"grid")
        } else this.setSize(1,1,"grid");
        
        this.applyAlignment();
    }

    draw(
        asciiCtx: CanvasRenderingContext2D,
        _bgCtx: CanvasRenderingContext2D,
    ): void {
        if (!this.bitmap) return;

        const x = this.gridX;
        const y = this.gridY;
        const w = this.bitmap.width;
        const h = this.bitmap.height;

        const v = this.opacity;
        const c = Math.floor(v * 255);

        asciiCtx.save();
        asciiCtx.beginPath();
        asciiCtx.rect(x, y, w, h);
        asciiCtx.clip();

        asciiCtx.globalCompositeOperation = "source-over";
        asciiCtx.drawImage(this.bitmap, x, y);

        asciiCtx.globalCompositeOperation = "source-in";
        asciiCtx.fillStyle = `rgb(${c}, ${c}, ${c})`;

        asciiCtx.fillRect(x, y, w, h);

        asciiCtx.restore();
    }
}
