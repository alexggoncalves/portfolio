import type { Element } from "./Element";
import { InteractiveElement } from "./InteractiveElement";
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
        // Update all interactive elements
        this.interactiveElements.forEach(
            (interactiveElement: InteractiveElement) => {
                // Apply scroll offset to elements
                if (this.isScrollable && interactiveElement.isScrollable) {
                    interactiveElement.setYOffset(yOffset);
                }

                interactiveElement.checkBoundaries(
                    yOffset,
                    window.innerHeight,
                    window.innerWidth,
                );

                // Update interactive element
                interactiveElement.update();
            },
        );

        // Update all elements in the layer
        this.elements.forEach((element: Element) => {
            // Apply scroll offset to elements
            if (this.isScrollable && element.isScrollable) {
                element.setYOffset(yOffset);
            }

            element.checkBoundaries(
                yOffset,
                window.innerHeight,
                window.innerWidth,
            );
        });
    }

    draw(
        asciiCtx: CanvasRenderingContext2D,
        bgCtx: CanvasRenderingContext2D,
        opacity: number,
    ): void {
        this.interactiveElements.forEach((element: Element) => {
            if (element.isInsidePageBoundaries) {
                element.setOpacity(opacity);
                element.draw(asciiCtx, bgCtx);
            }
        });
        this.elements.forEach((element: Element) => {
            if (element.isInsidePageBoundaries) {
                element.setOpacity(opacity);
                element.draw(asciiCtx, bgCtx);
            }
        });
    }

    addElement(element: Element): Element {
        if (element instanceof InteractiveElement) {
            this.interactiveElements.push(element);
        } else this.elements.push(element);

        return element;
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
}
