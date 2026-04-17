import { Color, Vector2 } from "three";
import Color4 from "three/src/renderers/common/Color4.js";
import getColorString from "../../../utils/color";
import drawRoundRect from "../../../utils/drawRoundRect";
import { RenderConfig } from "../../render/RenderConfig";

const createBrightnessMap = (asciiSequence: string) => {
    const asciiArray = asciiSequence.split("");
    const map = new Map<string, number>();

    asciiArray.forEach((char, index) => {
        let mappedBrightness = index / asciiArray.length + 0.002; //  Offset brightness to avoid rounding to wrong value

        map.set(char, mappedBrightness);
    });

    return map;
};

export const brightnessMap = createBrightnessMap(RenderConfig.asciiSequence);

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
    color: Color = new Color("white");
    backgroundColor: Color4 = new Color4(0);
    opacity: number;

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
        color?: Color,
        backgroundColor?: Color4,
        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom",
    ) {
        this.setPosition(x, y, unit);
        this.opacity = 0;

        if (color) this.color = color;
        if (backgroundColor) this.backgroundColor = backgroundColor;
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

            this.w = this.gridW * RenderConfig.charSize.x;
            this.h = this.gridH * RenderConfig.charSize.y;
        } else {
            if (arg3 === "grid") {
                this.gridW = arg1;

                if (arg2 !== undefined) {
                    this.gridH = arg2;
                }
                this.w = this.gridW * RenderConfig.charSize.x;
                this.h = this.gridH * RenderConfig.charSize.y;
            } else if (arg3 === "pixel") {
                this.w = arg1;

                if (arg2 !== undefined) {
                    this.h = arg2;
                }
                this.gridW = this.w / RenderConfig.charSize.x;
                this.gridH = this.h / RenderConfig.charSize.y;
            }
        }

    }

    setPosition(x: number, y: number, unit: Unit = "grid"): void {
        if (unit === "pixel") {
            this.x = x;
            this.y = y;
            this.gridX = Math.round(x / RenderConfig.charSize.x);
            this.gridY = Math.round(y / RenderConfig.charSize.y);
            this.originalGridX = this.gridX;
            this.originalGridY = this.gridY;
        } else if (unit === "grid") {
            this.gridX = x;
            this.gridY = y;
            this.x = x * RenderConfig.charSize.x;
            this.y = y * RenderConfig.charSize.y;
            this.originalGridX = x;
            this.originalGridY = y;
        }
    }

    setXOffset(value: number, unit: Unit = "grid"): void {
        if (unit === "pixel") {
            this.gridOffsetX = value / RenderConfig.charSize.x;
            this.offsetX = value;
        } else if (unit === "grid") {
            this.gridOffsetX = value;
            this.offsetX = value * RenderConfig.charSize.x;
        }
    }

    setYOffset(value: number, unit: Unit = "grid"): void {
        if (unit === "pixel") {
            this.gridOffsetY = value / RenderConfig.charSize.y;
            this.offsetY = value;
        } else if (unit === "grid") {
            this.gridOffsetY = value;
            this.offsetY = value * RenderConfig.charSize.y;
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
                Math.floor(RenderConfig.gridSize.x / 2) -
                Math.floor(this.gridW / 2);
        }
        if (this.horizontalAlign === "right") {
            offset.x = RenderConfig.gridSize.x - this.gridW;
        }

        if (this.verticalAlign === "middle") {
            offset.y =
                Math.floor(RenderConfig.gridSize.y / 2) - 
                Math.floor(this.gridH/2);
        }
        if (this.verticalAlign === "bottom") {
            offset.y = RenderConfig.gridSize.y - this.gridH;
        }

        this.gridX = this.originalGridX + offset.x;
        this.gridY = this.originalGridY + offset.y;

        this.x = this.gridX * RenderConfig.charSize.x;
        this.y = this.gridY * RenderConfig.charSize.y;
    }

    // Paint pixel on ui canvas
    drawPixel(
        x: number,
        y: number,
        r: number,
        g: number,
        b: number,
        brightnessValue: number,
        asciiCtx: CanvasRenderingContext2D,
    ): void {
        // Set color
        asciiCtx.fillStyle = `rgba(${r * 255 * this.opacity},${g * 255 * this.opacity},${b * 255 * this.opacity},${brightnessValue})`;

        // Clear and draw new character pixel
        asciiCtx.fillRect(x, y + this.gridOffsetY, 1, 1);
    }

    drawBlock(
        text: string,
        asciiCtx: CanvasRenderingContext2D,
        bgCtx: CanvasRenderingContext2D,
        positionOffset?: Vector2,
    ) {
        let x = this.gridX;
        let y = this.gridY;

        if (positionOffset) {
            x += positionOffset.x;
            y += positionOffset.y;
        }
        for (let i = 0; i < text.length; i++) {
            const char = text.charAt(i);

            if (char != "\n") {
                //  Draw background pixel
                if (this.backgroundColor.a != 0) {
                    this.drawBackgroundTexel(
                        x,
                        y,
                        RenderConfig.charSize.x,
                        RenderConfig.charSize.y,
                        this.backgroundColor,
                        bgCtx,
                    );
                }

                if (char != "") {
                    const brightnessValue = this.getBrightnessFromChar(char);

                    if (char !== undefined) {
                        // Draw ui pixel with char brightness as opacity
                        this.drawPixel(
                            x,
                            y,
                            this.color.r,
                            this.color.g,
                            this.color.b,
                            brightnessValue,
                            asciiCtx,
                        );
                    }
                }
                x++;
            } else {
                y++;
                x = this.gridX;
            }
        }
    }

    drawASCIILine(
        xA: number,
        yA: number,
        xB: number,
        yB: number,
        strokeWidth: number,
        r: number,
        g: number,
        b: number,
        brightnessValue: number,

        asciiCtx: CanvasRenderingContext2D,
    ): void {
        // Set color
        asciiCtx.strokeStyle = `rgba(${r * 255 * this.opacity},${g * 255 * this.opacity},${b * 255 * this.opacity},${brightnessValue * this.opacity})`;

        asciiCtx.lineWidth = strokeWidth;
        asciiCtx.beginPath();
        asciiCtx.moveTo(xA - strokeWidth / 2, yA);
        asciiCtx.lineTo(xB - strokeWidth / 2, yB);
        asciiCtx.stroke();
    }

    drawBackgroundTexel(
        x: number,
        y: number,
        w: number,
        h: number,
        color: Color4,
        bgCtx: CanvasRenderingContext2D,
    ): void {
        // Set ui color
        bgCtx.fillStyle = getColorString(color, this.opacity);

        // Clear and draw new character pixel
        bgCtx.fillRect(x * w, y * h, w, h);
    }

    drawBackgroundRect(
        x: number,
        y: number,
        w: number,
        h: number,
        radius: number,
        strokeOnly: boolean,
        color: Color4,
        bgCtx: CanvasRenderingContext2D,
    ): void {
        // Set ui color
        bgCtx.beginPath();

        if (radius > 0) {
            drawRoundRect(bgCtx, x, y, w, h, radius);
        } else {
            bgCtx.rect(x, y, w, h);
        }

        if (strokeOnly) {
            bgCtx.strokeStyle = "white";
            bgCtx.lineWidth = 2;
            bgCtx.stroke();
        } else {
            bgCtx.fillStyle = getColorString(color, this.opacity);
            bgCtx.fill();
        }
        bgCtx.closePath();
    }

    getBrightnessFromChar(char: string): number {
        const brightness = brightnessMap.get(char);
        if (brightness) return brightness;
        else return 0;
    }

    draw(
        _uiCtx: CanvasRenderingContext2D,
        _bgCtx: CanvasRenderingContext2D,
    ): void {}

    destroy(): void {}
}
