import { Color } from "three";

import { Element } from "../core/Element";
import { AsciiRenderConfig } from "../../app/AsciiRenderConfig";

//------------------------------------------
// Text Class
//------------------------------------------

export class CanvasText extends Element {
    lines: string[];

    lineHeight: number;
    font: string;
    fontSize: number;
    fontWeight: number;

    fontString: string;

    padding: number;

    constructor(
        x: number,
        y: number,
        text: string,
        font: string,
        fontSize: number,
        fontWeight: number,
        maxWidth: number, // in ascii cells
        lineHeight: number,
        padding: number,
        color: Color,
        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom",
    ) {
        super(x, y, "grid", color, undefined, horizontalAlign, verticalAlign);
        this.isScrollable = true;
        this.font = font;
        this.fontSize = fontSize;
        this.fontWeight = fontWeight;
        this.lineHeight = lineHeight;
        this.padding = padding;

        this.fontString = `${this.fontWeight} ${this.fontSize}px ${this.font}`;

        this.applyAlignment();

        // Calculate width in pixels
        const charWidth = AsciiRenderConfig.charSize.x;
        const textGridWidth = maxWidth - padding * 2;

        // Wrap the text
        this.lines = this.wrapText(text, textGridWidth * charWidth);

        // Calculate the height of the whole block
        this.setSize(
            textGridWidth,
            this.lines.length * this.lineHeight * fontSize,
            "grid",
        );
    }

    private static measureCtx: CanvasRenderingContext2D = (() => {
        const c = document.createElement("canvas");
        const ctx = c.getContext("2d")!;
        return ctx;
    })();

    draw(
        _asciiCtx: CanvasRenderingContext2D,
        bgCtx: CanvasRenderingContext2D,
    ): void {
        bgCtx.fillStyle = "white";
        bgCtx.textBaseline = "top";
        bgCtx.textAlign = "left";

        bgCtx.font = this.fontString

        const x =  Math.floor(this.x + this.padding * AsciiRenderConfig.charSize.x)
        const y =  Math.floor(this.y - this.offsetY)

        let yOffset = 0;
        this.lines.forEach((line) => {
            bgCtx.fillText(line, x, y + yOffset);
            yOffset += this.lineHeight * this.fontSize;
        });
    }

    wrapText(text: string, maxWidth: number) {
        const ctx = CanvasText.measureCtx;
        ctx.font = `${this.fontSize}px ${this.font}`;

        const words = text.split(" ");
        const lines: string[] = [];
        let currentLine = "";

        words.forEach((word) => {
            const testLine = currentLine ? currentLine + " " + word : word;

            const lineWidth = CanvasText.measureCtx.measureText(testLine).width;

            if (lineWidth <= maxWidth) {
                currentLine = testLine;
            } else {
                if (currentLine) lines.push(currentLine);
                currentLine = word;
            }
        });
        if (currentLine) lines.push(currentLine);

        return lines;
    }

    getGridSize(): { w: number; h: number } {
        return {
            w: this.gridW / AsciiRenderConfig.charSize.x,
            h: this.gridH / AsciiRenderConfig.charSize.y,
        };
    }
}
