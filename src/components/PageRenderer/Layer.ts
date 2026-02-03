import { Vector2 } from "three";
import type { Element } from "./Element";
import { clamp } from "three/src/math/MathUtils.js";

//-------------------------------
//          LAYER CLASS
//-------------------------------
export class Layer {
    name: string;
    elements: Element[] = [];

    // SCROLL
    isScrollable: boolean = false;
    scrollOffset: number = 0;
    maxScroll: number = 0;
    bottomScrollMargin: number = 0;
    readonly scrollDampingRange: number = 6;

    constructor(name: string, elements: Element[]) {
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
        scrollDelta: number,
    ): void {
        this.applyScroll(scrollDelta);

        this.elements.forEach((element: Element) => {
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

    applyScroll(scrollDelta: number): void {
        if (!this.isScrollable || !scrollDelta) return;

        const offset = this.scrollOffset;
        const max =  this.maxScroll;
        const distanceFromBottom = max - offset;

        const dampingRange = this.scrollDampingRange;
        let dampingMultiplier = 1;
        // Apply damping when scrolling near the top
        if (offset < dampingRange && scrollDelta < 0) {
            dampingMultiplier *= Math.min(
                dampingMultiplier,
                offset / dampingRange,
            );
        }

        // Apply damping when scrolling near the bottom
        if (distanceFromBottom < dampingRange && scrollDelta > 0) {
            dampingMultiplier *= Math.min(
                dampingMultiplier,
                distanceFromBottom / dampingRange,
            );
        }

        // Apply the scroll delta with damping
        this.scrollOffset += scrollDelta * dampingMultiplier;

        // Clamp the scroll offset between limits
        this.scrollOffset = clamp(this.scrollOffset,0,max)
    }

    destroy(): void {
        this.elements.forEach((element: Element) => {
            element.destroy();
        });
    }
}
