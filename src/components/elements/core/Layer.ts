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
        for (let i = 0; i < this.interactiveElements.length; i++) {
            const interactiveElement = this.interactiveElements[i];

            if (this.isScrollable && interactiveElement.isScrollable) {
                interactiveElement.setYOffset(yOffset);
            }

            interactiveElement.checkBoundaries(
                yOffset,
                window.innerHeight, // !!!!
                window.innerWidth, // !!!!
            );

            // Update interactive element
            interactiveElement.update();
        }

        for (let i = 0; i < this.elements.length; i++) {
            const element = this.elements[i];

            if (this.isScrollable && element.isScrollable) {
                element.setYOffset(yOffset);
            }

            element.checkBoundaries(
                yOffset,
                window.innerHeight, // !!!!
                window.innerWidth, // !!!!
            );
        }
    }

    draw(
        asciiCtx: CanvasRenderingContext2D,
        bgCtx: CanvasRenderingContext2D,
        opacity: number,
    ): void {
        for (let i = 0; i < this.interactiveElements.length; i++) {
            const element = this.interactiveElements[i];

            if (element.isInsidePageBoundaries) {
                element.setOpacity(opacity);
                element.draw(asciiCtx, bgCtx);
            }
        }

        for (let i = 0; i < this.elements.length; i++) {
            const element = this.elements[i];

            if (element.isInsidePageBoundaries) {
                element.setOpacity(opacity);
                element.draw(asciiCtx, bgCtx);
            }
        }
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

    destroy(): void {
        // Destroy normal elements
        this.elements.forEach((e) => e.destroy());
        this.elements.length = 0;

        // Destroy interactive elements
        this.interactiveElements.forEach((e) => e.destroy());
        this.interactiveElements.length = 0;

        this.goTo = () => {};
    }
}
