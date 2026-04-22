import { MathUtils } from "three";
import { AsciiRenderConfig } from "../../app/AsciiRenderConfig";
import type { Element } from "./Element";
import { InteractiveElement } from "./InteractiveElement";
import { Layer } from "./Layer";
//-------------------------------
//          LAYER CLASS
//-------------------------------
export class DraggableLayer extends Layer {
    x: number;
    y: number;
    w: number = 0;
    h: number;

    pageOffset: number = 0;

    xOffset: number = 0;

    // Dragging state
    mouseX: number = -1;
    mouseY: number = -1;
    dragStartX: number = 0;
    dragLastX: number = 0;
    velocity: number = 0;
    decay: number = 0.95;
    isMouseDown: boolean = false;

    constructor(
        name: string,
        elements: Element[],
        x: number,
        y: number,
        w: number,
        h: number,
        goTo?: (path: string) => void,
    ) {
        super(name, elements, goTo);

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.isDraggable = true;
    }

    update(_delta: number, yOffset: number): void {
        super.update(_delta, yOffset);
        this.pageOffset = -yOffset;

        this.updateDrag();
    }

    addElement(element: Element): Element {
        if (element instanceof InteractiveElement) {
            this.interactiveElements.push(element);
        } else this.elements.push(element);

        return element;
    }

    removeElement(element: Element): void {
        this.elements = this.elements.filter((e) => e !== element);
        this.interactiveElements = this.interactiveElements.filter(
            (e) => e !== element,
        );
    }

    updateDragState(
        mouseX: number,
        mouseY: number,
        isMouseDown: boolean,
    ): void {
        if (isMouseDown && !this.isMouseDown) {
            if (this.contains(mouseX, mouseY)) {
                this.isMouseDown = true;

                this.dragLastX = mouseX;
            }
        }

        // End drag
        if (!isMouseDown) {
            this.isMouseDown = false;
        }

        this.mouseX = mouseX;
    }

    destroy(): void {
        // Destroy normal elements
        this.elements.forEach((e) => e.destroy());
        this.elements = [];

        // Destroy interactive elements
        this.interactiveElements.forEach((e) => e.destroy());
        this.interactiveElements = [];

        this.goTo = undefined;
    }

    updateDrag() {
        const maxOffset = Math.max(0, this.w - AsciiRenderConfig.gridSize.x);

        if (this.isMouseDown) {
            const deltaX = this.mouseX - this.dragLastX;

            this.xOffset -= deltaX / AsciiRenderConfig.charSize.x;

            this.velocity = -deltaX / AsciiRenderConfig.charSize.x;
            this.dragLastX = this.mouseX;

            this.xOffset = MathUtils.clamp(this.xOffset, 0, maxOffset);
        } else {
            if (Math.abs(this.velocity) > 0.01) {
                this.xOffset += this.velocity;

                if (this.xOffset < 0 || this.xOffset > maxOffset) {
                    this.xOffset = MathUtils.clamp(this.xOffset, 0, maxOffset);
                    this.velocity = 0;
                }

                this.velocity *= this.decay;
            } else {
                this.velocity = 0;
            }
        }
    }

    contains(_x: number, y: number): boolean {
        const top = (this.y - this.pageOffset) * AsciiRenderConfig.charSize.y;

        const bottom = top + this.h * AsciiRenderConfig.charSize.y;

        return y > top && y < bottom;
    }
}
