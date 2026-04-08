import { Vector2 } from "three";

import { Layer } from "./Layer";
import type { MediaBlock } from "../../../stores/assetStore";
import type { Element } from "../../elements/Element";
import { CanvasImage } from "../../elements/CanvasImage";
// import { CanvasText } from "../../elements/CanvasText";
import { Video } from "../../elements/Video";

//-------------------------------
//          WORK CONTENT LAYOUT LAYER
//-------------------------------

export class WorkMediaLayout extends Layer {
    goTo: (path: string) => void;
    parent: HTMLElement;
    media: MediaBlock[];
    blocks: Element[] = [];

    layoutSize: Vector2 = new Vector2(0);

    placementPosition: Vector2;

    private imageGap: number = 1;
    // private textGap: number = 3;
    // private headingGap: number = 1;

    // private headingSize: number = 30;
    // private headingFont: string = "Space Grotesk";
    // private headingLineHeight: number = 1.1;
    // private headingPadding: number = 0;

    // private textSize: number = 16;
    // private textFont: string = "Open Sans";
    // private textLineHeight: number = 1.1;
    // private textPadding: number = 0;

    private bottomMargin: number = 6;

    constructor(
        media: MediaBlock[],
        position: Vector2,
        width: number,
        goTo: (path: string) => void,
        parent: HTMLElement,
        isMobile: boolean,
    ) {
        super("layout", [], goTo);

        this.layoutSize.x = width;

        this.media = media;
        this.goTo = goTo;
        this.parent = parent;
        this.placementPosition = position;

        this.isScrollable = true;

        this.createLayout(isMobile);
    }

    createLayout(_isMobile: boolean): void {
        // Go through all layout blocks and create elements
        this.media.forEach((block) => {
            switch (block.type) {
                case "heading":
                    // this.placeHeading(block.text);
                    break;
                case "text":
                    // this.placeText(block.paragraphs);
                    break;
                case "image":
                    this.placeImage(block.src, 21 / 9);
                    break;
                case "image-pair":
                    // this.placeImagePair(block.images, isMobile);
                    break;
                case "video":
                    this.placeVideo(block.src);
                    break;
            }
        });
        
        this.layoutSize.y += this.bottomMargin

        
    }

    // placeHeading(text: string): void {
    //     if (!text) return;

    //     this.placementPosition.y += this.headingGap * 2

    //     const textBlock = new CanvasText(
    //         text,
    //         this.headingFont,
    //         this.headingSize,
    //         600,
    //         this.placementPosition.clone(),
    //         this.layoutSize.x,
    //         this.headingLineHeight,
    //         this.headingPadding,
    //         new Color("white"),
    //     );

    //     this.elements.push(textBlock);
    //     this.placementPosition.y += textBlock.getGridSize().y + this.headingGap;
    //     this.layoutSize.y += textBlock.getGridSize().y + this.headingGap * 2;
    // }

    // placeText(paragraphs: string[]): void {
    //     paragraphs.forEach((text) => {
    //         if (!text) return;

    //         const textBlock = new CanvasText(
    //             text,
    //             this.textFont,
    //             this.textSize,
    //             400,
    //             this.placementPosition.clone(),
    //             this.layoutSize.x,
    //             this.textLineHeight,
    //             this.textPadding,
    //             new Color("white"),
    //         );
            
    //         const textHeight = textBlock.getGridSize().y

    //         this.elements.push(textBlock);
    //         this.placementPosition.y += textHeight + 1;
    //         this.layoutSize.y += textHeight + 1;
    //     });

    //     this.placementPosition.y += this.textGap;
    //     this.layoutSize.y += this.textGap;
    // }

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

        this.placementPosition.y += height + this.imageGap;
        this.layoutSize.y += height + this.imageGap;
    }

    // placeImagePair(
    //     images: { src: string; alt?: string }[],
    //     isMobile: boolean,
    // ): void {
    //     if (isMobile) {
    //         this.placeImage(images[0].src, 21 / 9);
    //         this.placeImage(images[1].src, 21 / 9);
    //     } else {
    //         const width = (this.layoutSize.x - this.imageGap) / 2;
    //         const height = width / (21 / 9);

    //         const position = this.placementPosition.clone();

    //         for (let i = 0; i < 2; i++) {
    //             const block = new CanvasImage(
    //                 images[i].src,
    //                 position.clone(),
    //                 width,
    //                 height,
    //             );

    //             this.elements.push(block);
    //             position.x += width + this.imageGap;
    //         }
    //         this.placementPosition.y += height + this.imageGap;
    //         this.layoutSize.y += height + this.imageGap;
    //     }
    // }

    placeVideo(src: string,): void {

        const width = (this.layoutSize.x * 12);
        const height = width / (21 / 9);

        const position = this.placementPosition.clone();

        const block = new Video(
            src,
            position,
            width,
            height,
        );

        this.placementPosition.y += block.gridSize.y + this.imageGap;
        this.layoutSize.y += block.gridSize.y + this.imageGap;
        this.interactiveElements.push(block);
    }
}
