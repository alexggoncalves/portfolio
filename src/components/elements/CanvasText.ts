import { Color, Vector2 } from "three";
import useAsciiStore from "../../stores/asciiStore";

import { Element } from "./Element";
import type Color4 from "three/src/renderers/common/Color4.js";

//------------------------------------------
// Text Class
//------------------------------------------

export class CanvasText extends Element {
    lines: string[];

    lineHeight: number;
    font: string;
    fontSize: number;

    padding: number;

    constructor(
        text: string,
        font: string,
        fontSize: number,
        position: Vector2,
        maxWidth: number, // width in ascii cells
        lineHeight: number,
        padding: number,
        color: Color,
        bgColor?: Color4,
    ) {
        super(position, color, bgColor);
        this.isScrollable = true;
        this.font = font;
        this.fontSize = fontSize;
        this.lineHeight = lineHeight;
        this.padding = padding;

        // Calculate width in pixels
        const charSize = useAsciiStore.getState().charSize;
        const width = maxWidth - padding * 2;

        // Wrap the text
        this.lines = this.wrapText(text, width * charSize.x);

        // Calculate the height of the whole block
        this.setSize(width, this.lines.length * this.lineHeight * fontSize);
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
        const charSize = useAsciiStore.getState().charSize;
        
        bgCtx.save();
        bgCtx.globalAlpha = this.opacity;
        bgCtx.fillStyle = "white";
        bgCtx.textBaseline = "top";
        bgCtx.textAlign = "left";
        
        bgCtx.font = `${this.font} ${this.fontSize}px monospace`;

        const position = {
            x: Math.floor(this.pixelPosition.x + this.padding * charSize.x),
            y: Math.floor(this.pixelPosition.y - this.pixelOffset.y),
        };

        let yOffset = 0;
        this.lines.forEach((line) => {
            
            bgCtx.fillText(line, position.x, position.y + yOffset);
            yOffset += this.lineHeight * this.fontSize;
        });

        bgCtx.restore();
    }

    wrapText(text: string, maxWidth: number) {
        const ctx = CanvasText.measureCtx;
        ctx.font = `${this.font} ${this.fontSize}px monospace`;

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

    getGridSize() {
        const charSize = useAsciiStore.getState().charSize;
        return this.gridSize.divide(charSize);
    }
}
