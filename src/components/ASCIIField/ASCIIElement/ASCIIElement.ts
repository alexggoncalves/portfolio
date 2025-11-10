import { Color, Vector2 } from "three";
import useAsciiStore from "../../../stores/asciiStore";
import Color4 from "three/src/renderers/common/Color4.js";

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
    useAsciiStore.getState().asciiSequence
);

const charSize = useAsciiStore.getState().charSize;

//-----------------------------------------
// ELEMENT CLASS
//-----------------------------------------

export class ASCIIElement {
    position: Vector2; // Position in relation to ascii grid
    size: Vector2 = new Vector2(1, 1); // Size in relation to ascii grid
    horizontalAlign: "left" | "center" | "right" = "left"; // Horizontal alignment
    verticalAlign: "top" | "middle" | "bottom" = "top"; // Vertical alignment

    // Colors
    color: Color = new Color("white");
    backgroundColor: Color4 = new Color4("transparent");
    opacity: number = 1.0;

    //Behaviour flags
    interactive: boolean = false;
    animated: boolean = false;
    needsUpdate: boolean = false;

    constructor(
        position: Vector2,
        color?: Color,
        backgroundColor?: Color4,
        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom"
    ) {
        this.position = position;
        if (color) this.color = color;
        if (backgroundColor) this.backgroundColor = backgroundColor;
        if (horizontalAlign) this.horizontalAlign = horizontalAlign;
        if (verticalAlign) this.verticalAlign = verticalAlign;
    }

    setSize(text: string): void;
    setSize(x: number, y: number): void;

    // Calculate ascii block size ([x]: max line lenght | [y]: number of lines)
    setSize(arg1: string | number, arg2?: number): void {
        if (typeof arg1 === "string") {
            const lines = (arg1.match(/\n/g) || "").length + 1;
            const maxlength = Math.max(
                ...arg1.split("\n").map((line) => line.length)
            );
            this.size.x = maxlength;
            this.size.y = lines;
        } else {
            this.size.x = arg1;
            if (arg2) this.size.y = arg2;
        }
    }

    setOpacity(value: number): void {
        this.opacity = value;
    }

    // Apply horizontal and vertical alignment
    applyAlignment() {
        const uiResolution = useAsciiStore.getState().uiResolution;
        const offset = new Vector2(0, 0);

        if (this.horizontalAlign === "right") {
            offset.x = uiResolution.x - this.size.x;
        } else if (this.horizontalAlign === "center") {
            offset.x = (uiResolution.x - this.size.x) / 2;
        }

        if (this.verticalAlign === "bottom") {
            offset.y = uiResolution.y - this.size.y;
        } else if (this.verticalAlign === "middle") {
            offset.y = (uiResolution.y - this.size.y) / 2;
        }

        this.position.x += offset.x;
        this.position.y += offset.y;
    }

    // Paint pixel on ui canvas
    drawPixel(
        x: number,
        y: number,
        color: Color4,
        ui: CanvasRenderingContext2D
    ): void {
        // Set color
        ui.save();
        ui.fillStyle = this.getColor(color);

        // Clear and draw new character pixel
        ui.fillRect(x, y, 1, 1);

        ui.restore();
    }

    drawBlock(
        text: string,
        ui: CanvasRenderingContext2D,
        background: CanvasRenderingContext2D,
        positionOffset?: Vector2
    ) {
        let x = this.position.x;
        let y = this.position.y;

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
                        charSize.x,
                        charSize.y,
                        this.backgroundColor,
                        background
                    );
                }

                if (char != "") {
                    const brightness = this.getBrightnessFromChar(char);

                    if (brightness !== undefined) {
                        // Draw ui pixel
                        this.drawPixel(
                            x,
                            y,
                            new Color4(
                                this.color.r,
                                this.color.g,
                                this.color.b,
                                brightness
                            ),
                            ui
                        );
                    }
                }
                x++;
            } else {
                y++;
                x = this.position.x;
            }
        }
    }

    drawASCIILine(
        pointA: Vector2,
        pointB: Vector2,
        strokeWidth: number,
        color: Color4,
        context: CanvasRenderingContext2D
    ): void {
        // Set color
        context.strokeStyle = this.getColor(color);

        context.lineWidth = strokeWidth;
        context.beginPath();
        context.moveTo(pointA.x - strokeWidth / 2, pointA.y);
        context.lineTo(pointB.x - strokeWidth / 2, pointB.y);
        context.stroke();
    }

    drawBackgroundTexel(
        x: number,
        y: number,
        w: number,
        h: number,
        color: Color4,
        context: CanvasRenderingContext2D
    ): void {
        context.save();
        // Set ui color
        context.fillStyle = this.getColor(color);

        // Clear and draw new character pixel
        context.clearRect(x * w, y * h, w, h);
        context.fillRect(x * w, y * h, w, h);

        context.restore();
    }

    drawBackgroundRect(
        x: number,
        y: number,
        w: number,
        h: number,
        color: Color4,
        context: CanvasRenderingContext2D
    ): void {
        context.save();
        // Set ui color
        context.fillStyle = this.getColor(color);

        // Clear and draw new character pixel
        context.fillRect(x, y, w, h);

        context.restore();
    }

    getColor(color: Color4): string {
        return `rgba(${color.r * 255 * this.opacity},
        ${color.g * 255 * this.opacity},
        ${color.b * 255 * this.opacity},
        ${color.a * this.opacity})`;
    }

    getBrightnessFromChar(char: string): number {
        const brightness = brightnessMap.get(char);
        if (brightness) return brightness;
        else return 0;
    }

    createHTMLLink(
        text: string,
        position: Vector2,
        size: Vector2,
        parent?: HTMLElement
    ): HTMLElement {
        const charSize = useAsciiStore.getState().charSize;
        const canvasOffset = useAsciiStore.getState().canvasOffset;
        const pixelRatio = useAsciiStore.getState().pixelRatio;

        // Create invisible html link
        const link = document.createElement("button");
        link.classList.add("asciiButton");
        link.textContent = `Go to ${text}`;
        link.style.cursor = "pointer";
        link.role = "link";

        // Set position and dimensions
        link.style.left = `${position.x * (charSize.x / pixelRatio) - canvasOffset.x - 1}px`;
        link.style.top = `${position.y * (charSize.y / pixelRatio) - canvasOffset.y - 1}px`;
        link.style.width = `${size.x * (charSize.x / pixelRatio)}px`;
        link.style.height = `${size.y * (charSize.y / pixelRatio)}px`;

        parent?.appendChild(link);

        return link;
    }

    draw(
        _ui: CanvasRenderingContext2D,
        _background: CanvasRenderingContext2D
    ): void {}

    update(_delta?: number, _mousePos?: Vector2, _mouseDown?: boolean): void {}

    destroy(): void {}

    destroyHTML(): void {}
}

//-----------------------------------------
// Ascii Block Class
//-----------------------------------------

export class ASCIIBlock extends ASCIIElement {
    text: string; // Ascii formated string

    constructor(
        text: string,
        position: Vector2,
        color: Color,
        backgroundColor: Color4,
        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom"
    ) {
        super(position, color, backgroundColor, horizontalAlign, verticalAlign);

        this.text = text;
        this.setSize(this.text);
        this.applyAlignment();
    }

    draw(
        ui: CanvasRenderingContext2D,
        background: CanvasRenderingContext2D
    ): void {
        this.drawBlock(this.text, ui, background);
    }

    update(): void {}

    fadeIn(): void {}

    fadeOut(): void {}
}

//-----------------------------------------
// Ascii Line Class
//-----------------------------------------

export class ASCIILine extends ASCIIElement {
    char: string; // character for the line
    pointA: Vector2;
    pointB: Vector2;
    strokeWidth: number;

    constructor(
        char: string,
        pointA: Vector2,
        pointB: Vector2,
        strokeWidth: number,
        color: Color,
        backgroundColor: Color4,
        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom"
    ) {
        super(pointA, color, backgroundColor, horizontalAlign, verticalAlign);

        this.char = char;
        this.setSize(this.char);
        // this.applyAlignment();

        this.strokeWidth = strokeWidth;
        this.pointA = pointA;
        this.pointB = pointB;
    }

    draw(
        ui: CanvasRenderingContext2D,
        _background: CanvasRenderingContext2D
    ): void {
        const brightness = brightnessMap.get(this.char);

        const color = new Color4(
            this.color.r,
            this.color.g,
            this.color.b,
            brightness
        );

        this.drawASCIILine(
            this.pointA,
            this.pointB,
            this.strokeWidth,
            color,
            ui
        );
    }

    update(): void {}

    fadeIn(): void {}

    fadeOut(): void {}
}
