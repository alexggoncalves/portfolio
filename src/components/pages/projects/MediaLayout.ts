import { Layer } from "../../elements/core/Layer";
import { CanvasImage } from "../../elements/canvas/CanvasImage";
import { VideoPlayer } from "../../elements/canvas/VideoPlayer";
import type { MediaBlock } from "../../assets/contentAssets";

//-------------------------------
//          MEDIA LAYOUT LAYER
//-------------------------------

export class MediaLayout extends Layer {
    goTo: (path: string) => void;
    media: MediaBlock[];

    x: number;
    y: number;
    w: number = 0;
    h: number = 0;

    placementY: number = 0;

    private imageGap: number = 2;

    constructor(
        media: MediaBlock[],
        x: number,
        y: number,
        width: number,
        goTo: (path: string) => void,
        isMobile: boolean,
    ) {
        super("layout", [], goTo);

        this.x = x;
        this.y = y;
        this.w = width;
        this.h = y;

        this.media = media;
        this.goTo = goTo;
        this.placementY = y;

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

        const height = this.w / aspectRatio;

        // Place thumbnail on canvas
        const block = new CanvasImage(
            src,
            this.x,
            this.placementY,
            this.w,
            height,
            0,
            "grid",
        );

        this.elements.push(block);

        this.placementY += block.gridH + this.imageGap;
        this.h += block.gridH + this.imageGap;
    }

    placeVideo(src: string): void {
        const width = this.w * 12;
        const height = width / (16 / 9);

        const block = new VideoPlayer(
            this,
            src,
            this.x,
            this.placementY,
            width,
            height,
        );

        this.placementY += block.gridH + this.imageGap;
        this.h += block.gridH + this.imageGap;
    }

    destroy(): void {
        super.destroy();
        this.goTo = () => {};
        this.media = [];
        this.media.length = 0;
    }
}
