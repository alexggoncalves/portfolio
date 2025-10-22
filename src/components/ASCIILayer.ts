import type { Vector2 } from "three";
import type { ASCIIElement } from "./ASCIIElement";

export class ASCIILayer {
    name: string;
    elements: Array<ASCIIElement> = [];

    constructor(name: string, elements: Array<ASCIIElement>) {
        this.name = name;
        this.elements = elements;
    }

    update(delta: number, mousePos: Vector2): void {
        this.elements.forEach((element: ASCIIElement) => {
            if (element.animated) {
                element.update(delta);
            } else if (element.interactive) {
                element.update(delta, mousePos, false);
            }
        });
    }

    draw(
        uiContext: CanvasRenderingContext2D,
        backgroundContext: CanvasRenderingContext2D
    ): void {
        this.elements.forEach((element: ASCIIElement) => {
            element.draw(uiContext, backgroundContext);
        });
    }

    addElement(element: ASCIIElement): void {
        this.elements.push(element);
    }

    destroy(): void {
        this.elements.forEach((element: ASCIIElement) => {
            element.destroy();
        });
    }
}
