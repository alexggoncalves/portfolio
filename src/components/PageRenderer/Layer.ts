import { Vector2 } from "three";
import type { Element } from "./Element";
//-------------------------------
//          LAYER CLASS
//-------------------------------
export class Layer {
    name: string;
    elements: Element[] = [];

    offset: Vector2;

    isScrollable: boolean = false;
    

    constructor(name: string, elements: Element[]) {
        this.name = name;
        this.elements = elements;
        this.offset = new Vector2(0)
    }

    init(): void {}

    update(
        uiContext: CanvasRenderingContext2D,
        backgroundContext: CanvasRenderingContext2D,
        delta: number,
        mousePos: Vector2,
        opacity: number,
        offset: number,
    ): void {
        this.offset.y = offset;

        console.log(offset)

        // Update all elements in the layer
        this.elements.forEach((element: Element) => {
            // Apply scroll offset to elements
            if(this.isScrollable){
                element.offset.y = this.offset.y;
            }

            // Update element
            if (element.animated) {
                element.update(delta);
            } else if (element.interactive) {
                element.update(delta, mousePos, false);
            }
        });

        this.draw(uiContext, backgroundContext, opacity);
    }

    draw(
        uiContext: CanvasRenderingContext2D,
        backgroundContext: CanvasRenderingContext2D,
        opacity: number,
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

    appendLayer(layer:Layer):void {
        layer.elements.forEach(element => {
            console.log(element)
        });
    }

    destroy(): void {
        this.elements.forEach((element: Element) => {
            element.destroy();
        });
    }
}
