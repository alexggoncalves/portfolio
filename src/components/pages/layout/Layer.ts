import { Vector2 } from "three";
import type { Element } from "../../elements/Element";
//-------------------------------
//          LAYER CLASS
//-------------------------------
export class Layer {
    name: string;
    elements: Element[] = [];

    // Scroll
    isScrollable: boolean = false;
    isDraggable: boolean = false;

    parent?: HTMLElement;
    goTo?: (path: string) => void ;

    constructor(name: string, elements: Element[], goTo?: (path: string) => void) {
        this.name = name;
        this.elements = elements;
        if(goTo) this.goTo = goTo;
    }

    update(
        asciiCtx: CanvasRenderingContext2D,
        bgCtx: CanvasRenderingContext2D,
        delta: number,
        mousePos: Vector2,
        opacity: number,
        yOffset: number,
    ): void {
        // Update all elements in the layer
        this.elements.forEach((element: Element) => {
            // Apply scroll offset to elements
            if (this.isScrollable) element.offset.y = yOffset;

            // Apply drag to elements
            if (this.isDraggable) element.offset.x = 0 // TEMP

            // Update element
            if (element.animated) {
                element.update(delta);
            } else if (element.interactive) {
                element.update(delta, mousePos, false);
            }
        });

        // Draw layer
        this.draw(asciiCtx, bgCtx, opacity);
    }

    draw(
        asciiCtx: CanvasRenderingContext2D,
        bgCtx: CanvasRenderingContext2D,
        opacity: number,
    ): void {
        this.elements.forEach((element: Element) => {
            element.setOpacity(opacity);
            element.draw(asciiCtx, bgCtx);
        });
    }

    addElement(element: Element): Element {
        this.elements.push(element);
        return element;
    }

    destroy(): void {
        this.elements.forEach((element: Element) => {
            element.destroy();
        });
    }
}
