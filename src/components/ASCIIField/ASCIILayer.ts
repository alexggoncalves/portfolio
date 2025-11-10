import { Vector2 } from "three";
import type { ASCIIElement } from "./ASCIIElement/ASCIIElement";

//-------------------------------
//          LAYER CLASS
//-------------------------------
export class ASCIILayer {
    name: string;
    elements: Array<ASCIIElement> = [];

    constructor(name: string, elements: Array<ASCIIElement>) {
        this.name = name;
        this.elements = elements;
    }

    init(): void {}

    update(
        uiContext: CanvasRenderingContext2D,
        backgroundContext: CanvasRenderingContext2D,
        delta: number,
        mousePos: Vector2,
        opacity: number
    ): void {
        this.elements.forEach((element: ASCIIElement) => {
            if (element.animated) {
                element.update(delta);
            } else if (element.interactive) {
                element.update(delta, mousePos, false);
            }
        });

        this.draw(uiContext,backgroundContext,opacity)
    }

    draw(
        uiContext: CanvasRenderingContext2D,
        backgroundContext: CanvasRenderingContext2D,
        opacity: number
    ): void {
        this.elements.forEach((element: ASCIIElement) => {
            element.setOpacity(opacity);
            element.draw(uiContext, backgroundContext);
        });
    }

    addElement(element: ASCIIElement): ASCIIElement {
        this.elements.push(element);

        return element;
    }

    destroy(): void {
        this.elements.forEach((element: ASCIIElement) => {
            element.destroy();
        });
    }
}
