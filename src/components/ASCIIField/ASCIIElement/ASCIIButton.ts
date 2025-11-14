import { Color, Vector2 } from "three";
import useAsciiStore from "../../../stores/asciiStore";
import Color4 from "three/src/renderers/common/Color4.js";

import { ASCIIElement } from "./ASCIIElement";

//------------------------------------------
// Button Class
//------------------------------------------

export class ASCIIButton extends ASCIIElement {
    text: string = ""; // Text to display on button
    domButton: HTMLElement; // Html button dom element
    callback: () => void; // Button's function

    // flags
    isMouseOver: boolean = false;
    isMouseDown: boolean = false;

    constructor(
        text: string,
        callback: () => void,
        position: Vector2,
        color: Color,
        backgroundColor: Color4,

        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom",
        parent?: HTMLElement,
        size?: Vector2
    ) {
        super(position, color, backgroundColor, horizontalAlign, verticalAlign);

        this.text = text;
        this.interactive = true;
        this.callback = callback;

        if (!size) {
            this.setSize(this.text);
        } else this.setSize(size.x,size.y)

        this.applyAlignment();

        // Create html button
        this.domButton = this.createHTMLLink(
            text,
            this.position,
            this.size,
            parent
        );

        // Set mouse event listeners
        this.domButton.addEventListener("click", () => this.onClick());
        this.domButton.addEventListener("mouseenter", () =>
            this.onMouseEnter()
        );
        this.domButton.addEventListener("mouseleave", () =>
            this.onMouseLeave()
        );
    }

    createHTML(parent?: HTMLElement): HTMLButtonElement {
        const charSize = useAsciiStore.getState().charSize;

        // const canvasOffset = useAsciiStore.getState().canvasOffset;
        const pixelRatio = useAsciiStore.getState().pixelRatio;

        // Create invisible html button
        const button = document.createElement("button");
        button.textContent = `Go to ${this.text}`;
        button.classList.add("asciiButton");
        button.style.cursor = "pointer";
        button.role = "link";

        // Set Position
        button.style.left = `${this.position.x * (charSize.x / pixelRatio)}px`;
        button.style.top = `${this.position.y * (charSize.y / pixelRatio)}px`;
        button.style.width = `${this.size.x * (charSize.x / pixelRatio)}px`;
        button.style.height = `${this.size.y * (charSize.y / pixelRatio)}px`;
        button.style.outline = "0px";

        parent?.appendChild(button);
        return button;
    }

    drawButtonFrame(
        strokeWeight: number,
        color: Color4,
        context: CanvasRenderingContext2D
    ): void {
        const charSize = useAsciiStore.getState().charSize;

        const x = this.position.x * charSize.x;
        const y = this.position.y * charSize.y;
        const w = this.size.x * charSize.x;
        const h = this.size.y * charSize.y;

        // Set color and stroke
        context.strokeStyle = `rgba(${color.r * 255},
        ${color.g * 255},
        ${color.b * 255},
        ${color.a * this.opacity})`;

        context.lineWidth = strokeWeight;

        // Draw rectangle
        context.strokeRect(x, y, w, h);
    }

    draw(
        ui: CanvasRenderingContext2D,
        background: CanvasRenderingContext2D
    ): void {
        this.drawBlock(this.text, ui, background);

        if (this.isMouseOver) {
            this.drawButtonFrame(1, new Color4(...this.color, 1), background);
        }
    }

    update(_delta?: number, _mousePos?: Vector2, _mouseDown?: boolean): void {}

    onClick(): void {
        if (this.callback) this.callback();
    }

    onMouseEnter(): void {
        this.isMouseOver = true;
    }

    onMouseLeave(): void {
        this.isMouseOver = false;
    }

    destroyHTML() {
        this.domButton.removeEventListener("click", () => this.onClick?.());
        this.domButton.removeEventListener("mouseenter", () =>
            this.onMouseEnter?.()
        );
        this.domButton.removeEventListener("mouseleave", () =>
            this.onMouseLeave?.()
        );
        this.domButton.remove();
    }
}
