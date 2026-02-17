import type { Element } from "../../elements/Element";
import { InteractiveElement } from "../../elements/InteractiveElement";
//-------------------------------
//          LAYER CLASS
//-------------------------------
export class Layer {
    name: string;
    elements: Element[] = [];
    interactiveElements: InteractiveElement[] = [];

    // Scroll
    isScrollable: boolean = false;
    isDraggable: boolean = false;

    parent?: HTMLElement;
    goTo?: (path: string) => void;

    constructor(
        name: string,
        elements: Element[],
        goTo?: (path: string) => void,
    ) {
        this.name = name;
        this.elements = elements;
        if (goTo) this.goTo = goTo;
    }

    update(_delta: number, yOffset: number): void {
        // Update all elements in the layer
        this.elements.forEach((element: Element) => {
            // Apply scroll offset to elements
            if (this.isScrollable && element.isScrollable) {
                element.setYOffset(yOffset);
            }

            // Apply drag offset to elements
            if (this.isDraggable) {
                element.setXOffset(0); // TEMP
            }
        });

        // Update all interactive elements
        this.interactiveElements.forEach(
            (interactiveElement: InteractiveElement) => {
                // Apply scroll offset to elements
                if (this.isScrollable && interactiveElement.isScrollable) {
                    interactiveElement.setYOffset(yOffset);
                }

                // Apply drag offset to elements
                if (this.isDraggable) {
                    interactiveElement.setXOffset(0); // TEMP
                }

                // Update interactive element
                interactiveElement.update();

                interactiveElement.isMouseOver = false;
            },
        );
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

        this.interactiveElements.forEach((element: Element) => {
            element.setOpacity(opacity);
            element.draw(asciiCtx, bgCtx);
        });
    }

    addElement(element: Element): Element {
        if (element instanceof InteractiveElement) {
            this.interactiveElements.push(element);
        } else this.elements.push(element);

        return element;
    }

    destroy(): void {
        this.elements.forEach((element: Element) => {
            element.destroy();
        });
    }
}
