import { Color, Vector2 } from "three";
import useAsciiStore from "../../stores/asciiStore";
import Color4 from "three/src/renderers/common/Color4.js";
import getColorString from "../../utils/color";

const createBrightnessMap = (asciiSequence: string) => {
    const asciiArray = asciiSequence.split("");
    const map = new Map<string, number>();

    asciiArray.forEach((char, index) => {
        let mappedBrightness = index / asciiArray.length + 0.002; //  Offset brightness to avoid rounding to wrong value

        map.set(char, mappedBrightness);
    });

    return map;
};

export const brightnessMap = createBrightnessMap(
    useAsciiStore.getState().asciiSequence,
);

const charSize = useAsciiStore.getState().charSize;

//-----------------------------------------
// ELEMENT CLASS
//-----------------------------------------

export class Element {
    gridPosition: Vector2; // Position in grid units
    gridSize: Vector2 = new Vector2(1); // Size in grid units

    pixelPosition: Vector2; // Position in pixel units
    pixelSize: Vector2 = new Vector2(1); // Size in pixel units

    gridOffset: Vector2 = new Vector2(0); // scroll offset in grid units
    pixelOffset: Vector2 = new Vector2(0);

    horizontalAlign: "left" | "center" | "right" = "left"; // Horizontal alignment
    verticalAlign: "top" | "middle" | "bottom" = "top"; // Vertical alignment

    // Colors
    color: Color = new Color("white");
    backgroundColor: Color4 = new Color4(0, 0, 0, 0);
    opacity: number;

    //Flags
    isInteractive: boolean = false;
    isAnimated: boolean = false;
    isScrollable: boolean = true;

    constructor(
        position: Vector2,
        color?: Color,
        backgroundColor?: Color4,
        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom",
    ) {
        this.gridPosition = position;
        this.pixelPosition = new Vector2(
            position.x * charSize.x,
            position.y * charSize.y,
        );

        this.opacity = 0;

        if (color) this.color = color;
        if (backgroundColor) this.backgroundColor = backgroundColor;
        if (horizontalAlign) this.horizontalAlign = horizontalAlign;
        if (verticalAlign) this.verticalAlign = verticalAlign;
    }

    setSize(text: string): void;
    setSize(x: number, y: number): void;

    // Calculate ascii block size ([x]: max line lenght | [y]: number of lines)
    setSize(arg1: string | number, arg2?: number): void {
        const charSize = useAsciiStore.getState().charSize;

        if (typeof arg1 === "string") {
            const lines = (arg1.match(/\n/g) || "").length + 1;
            const maxlength = Math.max(
                ...arg1.split("\n").map((line) => line.length),
            );
            this.gridSize.x = maxlength;
            this.gridSize.y = lines;
            
        } else {
            this.gridSize.x = arg1;
            
            if (arg2) {
                this.gridSize.y = arg2;
            }
        }

        this.pixelSize.x = this.gridSize.x * charSize.x;
        this.pixelSize.y = this.gridSize.y * charSize.y
    }

    setXOffset(value: number): void {
        this.gridOffset.x = value;
        this.pixelOffset.x = value * charSize.x;
    }

    setYOffset(value: number): void {
        this.gridOffset.y = value;
        this.pixelOffset.y = value * charSize.y;
    }

    setOpacity(value: number): void {
        this.opacity = value;
    }

    // Apply horizontal and vertical alignment
    applyAlignment() {
        const gridSize = useAsciiStore.getState().gridSize;
        const charSize = useAsciiStore.getState().charSize;

        const offset = new Vector2(0, 0);

        if (this.horizontalAlign === "right") {
            offset.x = gridSize.x - this.gridSize.x;
        } else if (this.horizontalAlign === "center") {
            offset.x = (gridSize.x - this.gridSize.x) / 2;
        }

        if (this.verticalAlign === "bottom") {
            offset.y = gridSize.y - this.gridSize.y;
        } else if (this.verticalAlign === "middle") {
            offset.y = (gridSize.y - this.gridSize.y) / 2;
        }

        this.gridPosition.x += offset.x;
        this.gridPosition.y += offset.y;

        this.pixelPosition.x = this.gridPosition.x * charSize.x;
        this.pixelPosition.y = this.gridPosition.y * charSize.y;
    }

    // Paint pixel on ui canvas
    drawPixel(
        x: number,
        y: number,
        color: Color4,
        asciiCtx: CanvasRenderingContext2D,
    ): void {
        // Set color

        asciiCtx.fillStyle = getColorString(color, this.opacity);

        // Clear and draw new character pixel
        asciiCtx.fillRect(x, y + this.gridOffset.y, 1, 1);
    }

    drawBlock(
        text: string,
        asciiCtx: CanvasRenderingContext2D,
        bgCtx: CanvasRenderingContext2D,
        positionOffset?: Vector2,
    ) {
        let x = this.gridPosition.x;
        let y = this.gridPosition.y;

        if (positionOffset) {
            x += positionOffset.x;
            y += positionOffset.y;
        }

        for (let i = 0; i < text.length; i++) {
            const char = text.charAt(i);

            if (char != "\n") {
                //  Draw background pixel
                if (this.backgroundColor.a != 0) {
                    bgCtx.save();
                    this.drawBackgroundTexel(
                        x,
                        y,
                        charSize.x,
                        charSize.y,
                        this.backgroundColor,
                        bgCtx,
                    );
                    bgCtx.restore();
                }

                if (char != "") {
                    const brightness = this.getBrightnessFromChar(char);

                    if (char !== undefined) {
                        asciiCtx.save();
                        // Draw ui pixel with char brightness as opacity
                        const color = new Color4(
                            this.color.r,
                            this.color.g,
                            this.color.b,
                            brightness,
                        );
                        this.drawPixel(x, y, color, asciiCtx);
                        asciiCtx.restore();
                    }
                }
                x++;
            } else {
                y++;
                x = this.gridPosition.x;
            }
        }
    }

    drawASCIILine(
        pointA: Vector2,
        pointB: Vector2,
        strokeWidth: number,
        color: Color4,
        asciiCtx: CanvasRenderingContext2D,
    ): void {
        // Set color
        asciiCtx.strokeStyle = getColorString(color, this.opacity);

        asciiCtx.lineWidth = strokeWidth;
        asciiCtx.beginPath();
        asciiCtx.moveTo(pointA.x - strokeWidth / 2, pointA.y);
        asciiCtx.lineTo(pointB.x - strokeWidth / 2, pointB.y);
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
        bgCtx.globalAlpha = this.opacity;
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
        bgCtx.save();

        // Set ui color
        bgCtx.beginPath();

        if (radius > 0) {
            bgCtx.globalAlpha = 1;
            bgCtx.beginPath();
            bgCtx.moveTo(x + radius, y);
            bgCtx.lineTo(x + w - radius, y);
            bgCtx.quadraticCurveTo(x + w, y, x + w, y + radius);
            bgCtx.lineTo(x + w, y + h - radius);
            bgCtx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
            bgCtx.lineTo(x + radius, y + h);
            bgCtx.quadraticCurveTo(x, y + h, x, y + h - radius);
            bgCtx.lineTo(x, y + radius);
            bgCtx.quadraticCurveTo(x, y, x + radius, y);
            bgCtx.closePath();
        } else {
            bgCtx.rect(x, y, w, h);
        }

        if (strokeOnly) {
            bgCtx.strokeStyle = getColorString(color, this.opacity);
            bgCtx.lineWidth = 2 * devicePixelRatio;
            bgCtx.stroke();
        } else {
            bgCtx.fillStyle = getColorString(color, this.opacity);
            bgCtx.fill();
        }
        bgCtx.restore();
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
