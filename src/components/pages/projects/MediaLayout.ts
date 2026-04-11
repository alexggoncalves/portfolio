import { Vector2 } from "three";

import { Layer } from "../../elements/core/Layer";
import type { MediaBlock } from "../../../stores/assetStore";
import { CanvasImage } from "../../elements/canvas/CanvasImage";
// import { CanvasText } from "../../elements/CanvasText";
import { CanvasVideo } from "../../elements/canvas/Video";

//-------------------------------
//          MEDIA LAYOUT LAYER
//-------------------------------

export class MediaLayout extends Layer {
    goTo: (path: string) => void;
    media: MediaBlock[];

    layoutSize: Vector2 = new Vector2(0);

    placementPosition: Vector2;

    private imageGap: number = 2;

    constructor(
        media: MediaBlock[],
        position: Vector2,
        width: number,
        goTo: (path: string) => void,
        isMobile: boolean,
    ) {
        super("layout", [], goTo);

        this.layoutSize.set(width,position.y)

        this.media = media;
        this.goTo = goTo;
        this.placementPosition = position;

        this.isScrollable = true;

        this.createLayout(isMobile);
    }

    createLayout(_isMobile: boolean): void {
        // Go through all layout blocks and create elements
        this.media.forEach((block) => {
            switch (block.type) {
                case "image":
                    this.placeImage(block.src, 21 / 9);
                    break;
                case "video":
                    this.placeVideo(block.src);
                    break;
            }
        });
        
        // this.layoutSize.y += this.bottomMargin
    }

    placeImage(src: string, aspectRatio: number): void {
        if (!src) return;

        const width = this.layoutSize.x;
        const height = this.layoutSize.x / aspectRatio;

        // Place thumbnail on canvas
        const block = new CanvasImage(
            src,
            this.placementPosition.clone(),
            width,
            height,
        );

        this.elements.push(block);

        this.placementPosition.y += block.gridSize.y + this.imageGap;
        this.layoutSize.y += block.gridSize.y + this.imageGap;
    }


    placeVideo(src: string,): void {

        const width = (this.layoutSize.x * 12);
        const height = width / (16 / 9);

        const position = this.placementPosition.clone();

        const block = new CanvasVideo(
            this,
            src,
            position,
            width,
            height,
        );

        this.placementPosition.y += block.gridSize.y + this.imageGap;
        this.layoutSize.y += block.gridSize.y + this.imageGap;
    }

    destroy(): void {
        
    }
}
