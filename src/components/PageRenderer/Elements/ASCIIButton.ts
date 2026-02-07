import { Color, Vector2 } from "three";
import useAsciiStore from "../../../stores/asciiStore";
import Color4 from "three/src/renderers/common/Color4.js";

import { Element } from "../Element";
import useCursorStore from "../../../stores/cursorStore";

//------------------------------------------
// Button Class
//------------------------------------------

export class ASCIIButton extends Element {
    text: string = ""; // Text to display on button
    domButton: HTMLElement; // Html button dom element
    callback: () => void; // Button's function
    resetCursorOnClick: boolean = true;

    // flags
    isMouseOver: boolean = false;
    isMouseDown: boolean = false;

    private clickHandler: () => void;
    private mouseEnterHandler: () => void;
    private mouseLeaveHandler: () => void;

    constructor(
        text: string,
        callback: () => void,
        position: Vector2,
        color: Color,
        backgroundColor: Color4,

        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom",
        parent?: HTMLElement,
        size?: Vector2,
        resetCursorOnClick?: boolean,
    ) {
        super(position, color, backgroundColor, horizontalAlign, verticalAlign);

        this.text = text;
        this.interactive = true;
        this.callback = callback;

        if (!size) {
            this.setSize(this.text);
        } else this.setSize(size.x, size.y);

        this.applyAlignment();

        if (resetCursorOnClick != undefined) this.resetCursorOnClick = resetCursorOnClick;

        // Create html button
        this.domButton = this.createHTMLLink(
            text,
            this.position,
            this.size,
            parent,
        );

        // Create references for the event handler callbacks
        this.clickHandler = () => this.onClick();
        this.mouseEnterHandler = () => this.onMouseEnter();
        this.mouseLeaveHandler = () => this.onMouseLeave();

        // Set mouse event listeners
        this.domButton.addEventListener("click", this.clickHandler);
        this.domButton.addEventListener("mouseenter", this.mouseEnterHandler);
        this.domButton.addEventListener("mouseleave", this.mouseLeaveHandler);
    }

    createHTML(parent?: HTMLElement): HTMLButtonElement {
        const charSize = useAsciiStore.getState().charSize;

        // Create invisible html button
        const button = document.createElement("button");
        button.textContent = `Go to ${this.text}`;
        button.classList.add("asciiButton");
        button.style.cursor = "none";
        button.role = "link";

        // Set Position
        button.style.left = `${this.position.x * charSize.x}px`;
        button.style.top = `${this.position.y * charSize.y}px`;
        button.style.width = `${this.size.x * charSize.x}px`;
        button.style.height = `${this.size.y * charSize.y}px`;
        button.style.outline = "0px";

        parent?.appendChild(button);
        return button;
    }

    drawButtonFrame(
        strokeWeight: number,
        color: Color4,
        context: CanvasRenderingContext2D,
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
        context.lineWidth = strokeWeight * devicePixelRatio;

        // Draw frame
        context.strokeRect(x, y, w, h);
    }

    draw(
        ui: CanvasRenderingContext2D,
        background: CanvasRenderingContext2D,
    ): void {
        this.drawBlock(this.text, ui, background);

        if (this.isMouseOver) {
            this.drawButtonFrame(2, new Color4(...this.color, 1), background);
        }
    }

    update(_delta?: number, _mousePos?: Vector2, _mouseDown?: boolean): void {}

    onClick(): void {
        if (this.callback) this.callback();

        if (this.resetCursorOnClick) {
            const setCursorState = useCursorStore.getState().setCursorState;
            setCursorState("default");
        }
    }

    onMouseEnter(): void {
        const setCursorState = useCursorStore.getState().setCursorState;

        this.isMouseOver = true;
        setCursorState("pointer");
    }

    onMouseLeave(): void {
        const setCursorState = useCursorStore.getState().setCursorState;

        this.isMouseOver = false;
        setCursorState("default");
    }

    destroyHTML() {
        this.domButton.removeEventListener("click", this.clickHandler);
        this.domButton.removeEventListener(
            "mouseenter",
            this.mouseEnterHandler,
        );
        this.domButton.removeEventListener(
            "mouseleave",
            this.mouseLeaveHandler,
        );
        this.domButton.remove();
    }
}
