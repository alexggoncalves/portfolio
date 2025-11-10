import { Color, Vector2 } from "three";
import Color4 from "three/src/renderers/common/Color4.js";

import { ASCIIElement } from "./ASCIIElement";

type Bounds = {
    left: number;
    top: number;
    right: number;
    bottom: number;
};

//------------------------------------------
// Ascii Frame Class
//------------------------------------------

export class ASCIIScreenFrame extends ASCIIElement {
    constructor(color: Color, backgroundColor: Color4) {
        super(new Vector2(0, 0), color, backgroundColor);
    }

    draw(
        ui: CanvasRenderingContext2D,
        _background: CanvasRenderingContext2D
    ): void {
        ui.fillStyle = `rgba(${this.color.r * 255},${this.color.g * 255}, ${
            this.color.b * 255
        },${0.1})`;

        ui.fillRect(2, 1, ui.canvas.width - 4, 1);
        ui.fillRect(1, 1, 1, ui.canvas.height - 2);
        ui.fillRect(ui.canvas.width - 2, 1, 1, ui.canvas.height - 2);
        ui.fillRect(2, ui.canvas.height - 2, ui.canvas.width - 4, 1);
    }

    update(): void {}
}

export class ASCIITitleFrame extends ASCIIElement {
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
        ui: CanvasRenderingContext2D,
        background: CanvasRenderingContext2D
    ): void {
        // Title
        this.drawBlock(this.title, ui, background, new Vector2(0, 0));

        const charBrightness = this.getBrightnessFromChar(this.char);

        ui.fillStyle = `rgba(${this.color.r * 255* this.opacity},${this.color.g * 255* this.opacity}, ${
            this.color.b * 255 * this.opacity
        },${this.opacity * charBrightness})`;

        // Top
        ui.fillRect(
            this.bounds.left + this.title.length + 1,
            this.bounds.top,
            this.size.x - this.title.length - 1,
            1
        );
        // Bottom
        ui.fillRect(this.bounds.left, this.bounds.bottom, this.size.x, 1);
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
