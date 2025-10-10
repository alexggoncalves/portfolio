import { Color, Vector2 } from "three";
import useAsciiStore from "../stores/asciiStore";
import Color4 from "three/src/renderers/common/Color4.js";

const createBrightnessMap = (asciiSequence: string) => {
    const asciiArray = asciiSequence.split("");
    const map = new Map<string, number>();

    asciiArray.forEach((char, index) => {
        const mappedBrightness = index / asciiArray.length;
        map.set(char, mappedBrightness);
    });

    return map;
};

const brightnessMap = createBrightnessMap(
    useAsciiStore.getState().asciiSequence
);
///////////////////////////////////////////
// ELEMENT CLASS
///////////////////////////////////////////

export class ASCIIElement {
    position: Vector2;
    size: Vector2;
    color: Color;
    backgroundColor: Color4;
    alignment: string = "left";

    constructor(
        position: Vector2,
        size: Vector2,
        color: Color,
        backgroundColor: Color4
        // alignment: "left"
    ) {
        this.position = position;
        this.size = size;
        this.color = color;
        this.backgroundColor = backgroundColor;
        // this.alignment = alignment;
    }

    draw(
        ui: CanvasRenderingContext2D,
        background: CanvasRenderingContext2D
    ): void {}

    drawPixel(
        x: number,
        y: number,
        color: Color4,
        context: CanvasRenderingContext2D
    ): void {
        // Set ui color
        context.fillStyle = `rgba(${color.r * 255},
        ${color.g * 255},
        ${color.b * 255},
        ${color.a})`;

        // Clear and draw new character pixel
        context.clearRect(x, y, 1, 1);
        context.fillRect(x, y, 1, 1);
    }

    drawBackground(
        x: number,
        y: number,
        color: Color4,
        context: CanvasRenderingContext2D
    ): void {
        // Set ui color
        context.fillStyle = `rgba(${color.r * 255},
        ${color.g * 255},
        ${color.b * 255},
        ${color.a})`;

        // Clear and draw new character pixel
        context.clearRect(x * 16, y * 16, 16, 16);
        context.fillRect(x * 16, y * 16, 16, 16);
    }
}

///////////////////////////////////////////
// Button Class
///////////////////////////////////////////

export class ASCIIButton extends ASCIIElement {
    text: string = "";

    constructor(
        text: string,
        position: Vector2,
        size: Vector2,
        color: Color,
        backgroundColor: Color4
        // alignment?: ASCIIElementAlignment
    ) {
        super(position, size, color, backgroundColor);

        this.text = text;
    }

    onHover(): void {}

    draw(): void {}

    update(): void {}
}

///////////////////////////////////////////
// Ascii Block Class
///////////////////////////////////////////

export class ASCIIBlock extends ASCIIElement {
    text: string;

    constructor(
        text: string,
        position: Vector2,
        size: Vector2,
        color: Color,
        backgroundColor: Color4
    ) {
        super(position, size, color, backgroundColor);

        this.text = text;
    }

    draw(
        ui: CanvasRenderingContext2D,
        background: CanvasRenderingContext2D
    ): void {
        let x = this.position.x;
        let y = this.position.y;

        for (let i = 0; i < this.text.length; i++) {
            const char = this.text.charAt(i);

            if (char != "\n") {
                //  Draw background pixel
                this.drawBackground(x, y, this.backgroundColor, background);

                if (char != "") {
                    // Get brightness to draw each character as ascii from the map (0-1.)
                    const brightness = brightnessMap.get(char);

                    if (brightness && brightness > 0) {
                        // Draw ui pixel
                        this.drawPixel(
                            x,
                            y,
                            new Color4(...this.color, brightness),
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
        background.beginPath();
                background.fillStyle = `rgba(${this.backgroundColor.r * 255},
                    ${this.backgroundColor.g * 255},
                    ${this.backgroundColor.b * 255},
                    ${0.1})`;
                background.arc(320, 300, 200, 0, 2 * Math.PI);
                background.fill();
    }

    update(): void {}

    fadeIn(): void {}

    fadeOut(): void {}
}

export class ASCIIScreenFrame extends ASCIIElement {
    constructor(
        position: Vector2,
        size: Vector2,
        color: Color,
        backgroundColor: Color
    ) {
        super(position, size, color, backgroundColor);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "white";
        ctx.fillRect(1, 1, ctx.canvas.width - 2, 1);
        ctx.fillRect(1, 1, 1, ctx.canvas.height - 2);
        ctx.fillRect(ctx.canvas.width - 2, 1, 1, ctx.canvas.height - 2);
        ctx.fillRect(1, ctx.canvas.height - 2, ctx.canvas.width - 2, 1);

        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.ellipse(14, 13, 10, 10, 0, 0, 2 * Math.PI); // x, y, radiusX, radiusY, rotation, startAngle, endAngle
        ctx.fill();
    }

    update(): void {}

    fadeIn(): void {}

    fadeOut(): void {}
}
