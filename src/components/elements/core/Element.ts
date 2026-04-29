import { Vector2 } from "three";
// import getColorString from "../../../utils/color";
import drawRoundRect from "../../../utils/drawRoundRect";
import { AsciiRenderConfig } from "../../app/AsciiRenderConfig";

export const grayscaleCache = new Array(256);

for (let i = 0; i < 256; i++) {
    grayscaleCache[i] = `rgb(${i},${i},${i}, 1)`;
}

//-----------------------------------------
// ELEMENT CLASS
//-----------------------------------------

export type Unit = "pixel" | "grid";

export class Element {
    // Position (grid + pixel)
    x: number = 0;
    y: number = 0;
    gridX: number = 0;
    gridY: number = 0;

    originalGridX: number = 0;
    originalGridY: number = 0;

    // Size
    w: number = 0;
    h: number = 0;
    gridW: number = 0;
    gridH: number = 0;

    // Offset
    offsetX: number = 0;
    offsetY: number = 0;
    gridOffsetX: number = 0;
    gridOffsetY: number = 0;

    horizontalAlign: "left" | "center" | "right" = "left"; // Horizontal alignment
    verticalAlign: "top" | "middle" | "bottom" = "top"; // Vertical alignment

    // Colors
    color: string = "white";
    opacity: number = 0;

    //Flags
    isInteractive: boolean = false;
    isAnimated: boolean = false;
    isScrollable: boolean = true;
    isInsidePageBoundaries: boolean = true;

    name: string = "";

    private _offset = new Vector2();

    constructor(
        x: number,
        y: number,
        unit: Unit = "grid",
        color?: string,
        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom",
    ) {
        this.setPosition(x, y, unit);

        if (color) {
            this.color = color;
        }
        if (horizontalAlign) this.horizontalAlign = horizontalAlign;
        if (verticalAlign) this.verticalAlign = verticalAlign;
    }

    checkBoundaries(pageY: number, pageHeight: number, pageWidth: number) {
        this.isInsidePageBoundaries = true;
        return;

        const left = this.x - this.offsetX;
        const right = this.x + this.w - this.offsetX;
        const top = this.y - this.offsetY;
        const bottom = this.y + this.h - this.offsetY;

        const horizontallyVisible = right > 0 && left < pageWidth;
        const verticallyVisible = bottom > pageY && top < pageY + pageHeight;

        this.isInsidePageBoundaries = horizontallyVisible && verticallyVisible;
    }

    setSize(text: string): void;
    setSize(x: number, y: number, unit: Unit): void;

    // Calculate ascii block size ([x]: max line lenght | [y]: number of lines)
    setSize(arg1: string | number, arg2?: number, arg3?: Unit): void {
        if (typeof arg1 === "string") {
            const lines = (arg1.match(/\n/g) || "").length + 1;
            const maxlength = Math.max(
                ...arg1.split("\n").map((line) => line.length),
            );
            this.gridW = maxlength;
            this.gridH = lines;

            this.w = this.gridW * AsciiRenderConfig.charSize.x;
            this.h = this.gridH * AsciiRenderConfig.charSize.y;
        } else {
            if (arg3 === "grid") {
                this.gridW = arg1;

                if (arg2 !== undefined) {
                    this.gridH = arg2;
                }
                this.w = this.gridW * AsciiRenderConfig.charSize.x;
                this.h = this.gridH * AsciiRenderConfig.charSize.y;
            } else if (arg3 === "pixel") {
                this.w = arg1;

                if (arg2 !== undefined) {
                    this.h = arg2;
                }
                this.gridW = this.w / AsciiRenderConfig.charSize.x;
                this.gridH = this.h / AsciiRenderConfig.charSize.y;
            }
        }
    }

    setPosition(x: number, y: number, unit: Unit = "grid"): void {
        if (unit === "pixel") {
            this.x = x;
            this.y = y;
            this.gridX = Math.round(x / AsciiRenderConfig.charSize.x);
            this.gridY = Math.round(y / AsciiRenderConfig.charSize.y);
            this.originalGridX = this.gridX;
            this.originalGridY = this.gridY;
        } else if (unit === "grid") {
            this.gridX = x;
            this.gridY = y;
            this.x = x * AsciiRenderConfig.charSize.x;
            this.y = y * AsciiRenderConfig.charSize.y;
            this.originalGridX = x;
            this.originalGridY = y;
        }
    }

    setXOffset(value: number, unit: Unit = "grid"): void {
        if (unit === "pixel") {
            this.gridOffsetX = value / AsciiRenderConfig.charSize.x;
            this.offsetX = value;
        } else if (unit === "grid") {
            this.gridOffsetX = value;
            this.offsetX = value * AsciiRenderConfig.charSize.x;
        }
    }

    setYOffset(value: number, unit: Unit = "grid"): void {
        if (unit === "pixel") {
            this.gridOffsetY = value / AsciiRenderConfig.charSize.y;
            this.offsetY = value;
        } else if (unit === "grid") {
            this.gridOffsetY = value;
            this.offsetY = value * AsciiRenderConfig.charSize.y;
        }
    }

    setOpacity(value: number): void {
        this.opacity = value;
    }

    // Apply horizontal and vertical alignment
    applyAlignment() {
        const offset = this._offset;
        offset.set(0, 0);

        if (this.horizontalAlign === "center") {
            offset.x =
                Math.floor(AsciiRenderConfig.gridSize.x / 2) -
                Math.floor(this.gridW / 2);
        }
        if (this.horizontalAlign === "right") {
            offset.x = AsciiRenderConfig.gridSize.x - this.gridW;
        }

        if (this.verticalAlign === "middle") {
            offset.y =
                Math.floor(AsciiRenderConfig.gridSize.y / 2) -
                Math.floor(this.gridH / 2);
        }
        if (this.verticalAlign === "bottom") {
            offset.y = AsciiRenderConfig.gridSize.y - this.gridH;
        }

        this.gridX = this.originalGridX + offset.x;
        this.gridY = this.originalGridY + offset.y;

        this.x = this.gridX * AsciiRenderConfig.charSize.x;
        this.y = this.gridY * AsciiRenderConfig.charSize.y;
    }

    static drawBlock(
        bitmap: ImageBitmap,
        gridX: number,
        gridY: number,
        asciiCtx: CanvasRenderingContext2D,
        opacity: number,
    ) {
        if (!bitmap) return;

        const x = gridX;
        const y = gridY;
        const w = bitmap.width;
        const h = bitmap.height;

        asciiCtx.save();
        asciiCtx.beginPath();
        asciiCtx.rect(x, y, w, h);
        asciiCtx.clip();
        asciiCtx.globalCompositeOperation = "source-over";
        asciiCtx.drawImage(bitmap, x, y);

        // Apply fade-in mask
        const v = opacity;
        const c = Math.round(v * 255);
        asciiCtx.fillStyle = grayscaleCache[c];
        asciiCtx.globalCompositeOperation = "source-in";
        asciiCtx.fillRect(x, y, w, h);
        asciiCtx.closePath();
        asciiCtx.restore();
    }

    static drawASCIILine(
        xA: number,
        yA: number,
        xB: number,
        yB: number,
        strokeWidth: number,
        strokeStyle: string,
        asciiCtx: CanvasRenderingContext2D,
    ): void {
        asciiCtx.beginPath();
        asciiCtx.lineWidth = strokeWidth;
        asciiCtx.strokeStyle = strokeStyle;
        // asciiCtx.strokeStyle = `rgba(${r * 255},${g * 255},${b * 255},${brightnessValue})`;
        asciiCtx.moveTo(xA - strokeWidth / 2, yA);
        asciiCtx.lineTo(xB - strokeWidth / 2, yB);
        asciiCtx.stroke();
    }

    static drawRect(
        x: number,
        y: number,
        w: number,
        h: number,
        radius: number,
        strokeOnly: boolean,
        color: string,
        context: CanvasRenderingContext2D,
    ): void {
        // Set ui color
        context.beginPath();

        if (radius > 0) {
            drawRoundRect(context, x, y, w, h, radius);
        } else {
            context.rect(x, y, w, h);
        }

        if (strokeOnly) {
            context.strokeStyle = color;
            context.lineWidth = 2;
            context.stroke();
        } else {
            context.fillStyle = color;
            context.fill();
        }
        context.closePath();
    }

    draw(
        _uiCtx: CanvasRenderingContext2D,
        _bgCtx: CanvasRenderingContext2D,
    ): void {}

    destroy(): void {}
}
