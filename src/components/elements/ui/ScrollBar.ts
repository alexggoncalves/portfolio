import { DraggableLayer } from "../core/DraggableLayer";

//-------------------------------
//          ScrollBar LAYER
//-------------------------------

export class ScrollBar extends DraggableLayer {

    // Dragging state
    mouseX: number = -1;
    mouseY: number = -1;

    dragStartX: number = 0;
    dragLastX: number = 0;
    velocity: number = 0;
    decay: number = 0.95;
    isMouseDown: boolean = false;

    constructor(
        x: number,
        y: number,
        w: number,
        h: number,
    ) {
        super("works-row", [],x,y,w,h, undefined);

        this.x = x;
        this.y = y;

        // Scroll values
        this.isScrollable = true;
        this.isDraggable = true;
    }

       

    update(_delta: number, yOffset: number): void {
        super.update(_delta, yOffset);

        this.updateDrag();
    }

    // contains(_x: number, y: number): boolean {
    //     if (!this.cards[0]) return false;

    //     const top = this.cards[0].y - this.cards[0].offsetY;
    //     const bottom = top + this.cards[0].h;

    //     return y > top && y < bottom;
    // }



    destroy(): void {

        super.destroy();
    }
}
