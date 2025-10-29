import { Vector2 } from "three";
import type { ASCIIElement } from "./ASCIIElement";
//-------------------------------
//          LAYER CLASS
//-------------------------------

export class ASCIILayer {
    name: string;
    elements: Array<ASCIIElement> = [];
    opacity: number = 1.0;

    constructor(name: string, elements: Array<ASCIIElement>) {
        this.name = name;
        this.elements = elements;
    }

    init(): void {}

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


