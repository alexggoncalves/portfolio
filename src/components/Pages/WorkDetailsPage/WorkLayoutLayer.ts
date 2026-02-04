import { Vector2 } from "three";

import { Layer } from "../../PageRenderer/Layer";
import type { LayoutBlock } from "../../../stores/contentStore";
import type { Element } from "../../PageRenderer/Element";
import { CanvasImage } from "../../PageRenderer/Elements/CanvasImage";

//-------------------------------
//          WORKS GRID LAYER
//-------------------------------

export class WorkLayoutLayer extends Layer {
    goTo: (path: string) => void;
    parent: HTMLElement;
    layoutBlocks: LayoutBlock[];
    blocks: Element[] = [];

    layoutHeight: number = 0;

    placementPosition: Vector2;

    constructor(
        layoutBlocks: LayoutBlock[],
        position: Vector2,
        goTo: (path: string) => void,
        parent: HTMLElement,
        isMobile: boolean,
    ) {
        super("layout", []);
        this.layoutBlocks = layoutBlocks;
        this.goTo = goTo;
        this.parent = parent;
        this.placementPosition = position;

        this.isScrollable = true;
        this.bottomScrollMargin = 6; // TEMP

        this.createLayout(isMobile);
    }

    createLayout(isMobile: boolean): void {
        // Go through all layout blocks and create elements
        this.layoutBlocks.forEach((element) => {
            switch (element.type) {
                case "heading":
                    this.placeHeading();
                    break;
                case "text":
                    this.placeText();
                    break;
                case "image":
                    this.placeImage(element.src);
                    break;
                case "image-pair":
                    this.placeImagePair(isMobile);
                    break;
                case "video":
                    this.placeVideo();
                    break;
            }
        });

        // Calculate scroll length based on layout height
        this.maxScroll = Math.max(
            0,
            this.layoutHeight + this.bottomScrollMargin,
        );
    }

    placeHeading(): void {}

    placeText(): void {}

    placeImage(src: string): void {
        if (!src) return;

        // Place thumbnail on canvas
        const block = new CanvasImage(
            src,
            this.placementPosition.clone(),
            21 * 4,
            9 * 4,
        );

        this.elements.push(block);

        this.placementPosition.y += 9 * 4;

        this.layoutHeight += 9 * 4;
    }

    placeImagePair(isMobile: boolean): void {
        if (isMobile) {
            //Place two normal images
        } else {
            //Place the images side by side
        }
    }

    placeVideo(): void {}

    update(
        uiContext: CanvasRenderingContext2D,
        backgroundContext: CanvasRenderingContext2D,
        delta: number,
        mousePos: Vector2,
        opacity: number,
        scrollDelta: number,
    ): void {
        super.update(
            uiContext,
            backgroundContext,
            delta,
            mousePos,
            opacity,
            scrollDelta,
        );

        //Apply scroll to layout elements
        this.elements.forEach((element: Element) => {
            if (element instanceof CanvasImage) {
                element.yOffset = this.scrollOffset;
            }
        });
    }

    destroy(): void {}
}
