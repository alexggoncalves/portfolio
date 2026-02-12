import { Color, Vector2 } from "three";
import Color4 from "three/src/renderers/common/Color4.js";

import { Element } from "./Element";

//-----------------------------------------
// Ascii Text Class
//-----------------------------------------

export class ASCIIText extends Element {
    text: string; // Ascii formated string

    constructor(
        text: string,
        position: Vector2,
        color: Color,
        bgColor: Color4,
        maxWidth: number,
        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom"
    ) {
        super(position, color, bgColor, horizontalAlign, verticalAlign);
        this.text = this.wrapText(text, maxWidth);

        this.setSize(this.text);
        this.applyAlignment();
    }

    draw(
        asciiCtx: CanvasRenderingContext2D,
        bgCtx: CanvasRenderingContext2D,
    ): void {
        this.drawBlock(this.text, asciiCtx, bgCtx);
    }

    wrapText(text: string, maxWidth: number) {
        const paragraphs = text.split("\n");
        const wrappedParagraphs: string[] = [];

        paragraphs.forEach((paragraph) => {
            const words = paragraph.split(" ");
            const lines: string[] = [];
            let currentLine = "";

            words.forEach((word) => {
                // console.log(word)
                if (word.length + currentLine.length <= maxWidth) {
                    currentLine += (currentLine ? " " : "") + word;
                } else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            });
            if (currentLine) lines.push(currentLine);
            wrappedParagraphs.push(lines.join("\n"));
        });

        return wrappedParagraphs.join("\n\n");
    }
}
