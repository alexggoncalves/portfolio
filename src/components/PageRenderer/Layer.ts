import { Vector2 } from "three";
import type { Element } from "./Elements/Element";

//-------------------------------
//          LAYER CLASS
//-------------------------------
export class Layer {
    name: string;
    elements: Array<Element> = [];

    constructor(name: string, elements: Array<Element>) {
        this.name = name;
        this.elements = elements;
    }

    init(): void {}

    update(
        uiContext: CanvasRenderingContext2D,
        backgroundContext: CanvasRenderingContext2D,
        delta: number,
        mousePos: Vector2,
        opacity: number,
        _scrollDelta: number
    ): void {
        this.elements.forEach((element: Element) => {
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
        this.elements.forEach((element: Element) => {
            element.setOpacity(opacity);
            element.draw(uiContext, backgroundContext);
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
