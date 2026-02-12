import { Color, Vector2 } from "three";
import Color4 from "three/src/renderers/common/Color4.js";

import { Element } from "./Element";

type Bounds = {
    left: number;
    top: number;
    right: number;
    bottom: number;
};

//------------------------------------------
// Ascii Frame Class
//------------------------------------------

export class ASCIIScreenFrame extends Element {
    constructor(color: Color, backgroundColor: Color4) {
        super(new Vector2(0, 0), color, backgroundColor);
    }

    draw(
        asciiCtx: CanvasRenderingContext2D,
        _bgCtx: CanvasRenderingContext2D,
    ): void {
        asciiCtx.fillStyle = `rgba(${this.color.r * 255},${this.color.g * 255}, ${
            this.color.b * 255
        },${this.getBrightnessFromChar("o")})`;

        // ui.fillRect(0, 0, ui.canvas.width, 2);
        // ui.fillRect(0, 2, 2, ui.canvas.height-4);
        // ui.fillRect(ui.canvas.width - 2, 2, 2, ui.canvas.height - 4);
        // ui.fillRect(0, ui.canvas.height-2, ui.canvas.width, 2);
    }

    update(): void {}
}

export class ASCIITitleFrame extends Element {
    char: string;
    title: string;
    bounds: Bounds;

    constructor(
        char: string,
        title: string,
        position: Vector2,
        size: Vector2,
        color: Color,
        backgroundColor: Color4
    ) {
        super(position, color, backgroundColor);

        this.setSize(size.x, size.y);
        this.bounds = this.calculateBounds();
        this.title = title;
        this.char = char
    }

    draw(
        asciiCtx: CanvasRenderingContext2D,
        bgCtx: CanvasRenderingContext2D,
    ): void {
        // Title
        this.drawBlock(this.title, asciiCtx, bgCtx, new Vector2(0, 0));

        const charBrightness = this.getBrightnessFromChar(this.char);

        asciiCtx.fillStyle = `rgba(${this.color.r * 255* this.opacity},${this.color.g * 255* this.opacity}, ${
            this.color.b * 255 * this.opacity
        },${this.opacity * charBrightness})`;

        // Top
        asciiCtx.fillRect(
            this.bounds.left + this.title.length + 1,
            this.bounds.top,
            this.size.x - this.title.length - 1,
            1
        );
        // Bottom
        asciiCtx.fillRect(this.bounds.left, this.bounds.bottom, this.size.x, 1);
    }

    calculateBounds(): Bounds {
        const left = this.position.x;
        const top = this.position.y;
        const right = this.position.x + this.size.x;
        const bottom = this.position.y + this.size.y;

        return { left, top, right, bottom };
    }

    update(): void {}
}
