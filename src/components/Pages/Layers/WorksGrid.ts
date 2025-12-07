import { Vector2, Color } from "three";

import { Layer } from "../../PageRenderer/Layer";

import type { Work } from "../../../stores/contentStore";
import { FadeGradient } from "../../PageRenderer/Elements/FadeGradient";

import useSceneStore from "../../../stores/sceneStore";
import useAsciiStore from "../../../stores/asciiStore";

import { Element } from "../../PageRenderer/Elements/Element";
import { WorkCard } from "../Layers/WorkCard";
import { lerp } from "three/src/math/MathUtils.js";

//-------------------------------
//          WORKS GRID LAYER
//-------------------------------

export class WorksGrid extends Layer {
    goTo: (path: string) => void;
    parent: HTMLElement;
    
    works: Work[] = [];

    position: Vector2;
    gridSize: Vector2 = new Vector2(0)
    cols: number;
    rows: number;
    margin: number
    gap: number;
    imageAspectRatio: number = 5 / 3;

    scrollOffset: number = 0;
    targetScrollOffset: number = 0;
    maxScroll:number = 0;
    bottomScrollMargin: number = 6;
    scrollSmoothness: number = 0.14;
    
    constructor(                 
        works: Work[],              
        position: Vector2,
        width: number,
        columns: number,
        margin: number,
        gap: number,
        goTo: (path: string) => void,
        parent: HTMLElement,
        _isMobile: boolean,
    ) {
        super("frame", []);
        this.goTo = goTo;
        this.parent = parent;

        this.works = works;

        this.position = position
        this.gridSize.x = width
        this.cols = columns;
        this.rows = Math.ceil(this.works.length / this.cols);
        
        this.margin = margin;
        this.gap = gap;

        this.createGrid();      
        
    }

    createGrid(): void {
        const uiResolution = useAsciiStore.getState().uiResolution;

        // Image size in the ascii grid dimensions
        const imageWidth = (this.gridSize.x - (this.cols - 1) * this.gap)/this.cols;
        const imageHeight = Math.floor(imageWidth / this.imageAspectRatio);

        // Determine initial visible height
        const initialVisibleHeight = Math.min(uiResolution.y, imageHeight * 1.5);

        const topSpace = uiResolution.y - initialVisibleHeight - 2;

        // Calculate total grid height
        this.gridSize.y = (imageHeight + this.gap) * this.rows - this.gap
        this.maxScroll = Math.max(0, this.gridSize.y - initialVisibleHeight + this.bottomScrollMargin);

        const startPosition = new Vector2(this.margin, topSpace);

        const offset = new Vector2(0, 0);
        this.works.forEach((work: Work, index) => {
            // Offset within the grid
            offset.x = (imageWidth + this.gap) * (index % this.cols);
            offset.y = (imageHeight + this.gap) * Math.floor(index / this.cols);

            // Get thumbnail asset source
            const thumbnailSrc = work.assets.find(
                (asset) => asset.type === "thumbnail"
            )?.src;
            if (!thumbnailSrc) return;

            // Create thumbnail image
            const thumbnail = new Image();
            thumbnail.crossOrigin = "anonymous";
            thumbnail.src = thumbnailSrc;

            // Create work card
            if (thumbnail) {
                const card = new WorkCard(
                    thumbnail, // Thumbnail
                    work.title,
                    work.id,
                    new Vector2( // Position
                        startPosition.x + offset.x,
                        startPosition.y + offset.y
                    ),
                    new Vector2(imageWidth, imageHeight), // Size,
                    this.goTo,
                    this.parent
                );

                // Add card to the grid
                this.addElement(card);
            }
        });

        const bgColor = useSceneStore.getState().backgroundColor;

        this.addElement(
            new FadeGradient(
                new Color(bgColor),
                new Vector2(0, 4),
                new Vector2(uiResolution.x,7),
                "top"
            )
        );
        this.addElement(
            new FadeGradient(
                new Color(bgColor),
                new Vector2(0, uiResolution.y - 5),
                new Vector2(uiResolution.x, 7),
                "bottom"
            )
        );
    }

    update(
        uiContext: CanvasRenderingContext2D,
        backgroundContext: CanvasRenderingContext2D,
        delta: number,
        mousePos: Vector2,
        opacity: number,
        scrollDelta: number
    ): void {

        if(scrollDelta) {
            this.targetScrollOffset += scrollDelta
            this.targetScrollOffset = Math.max (0,Math.min(this.targetScrollOffset,this.maxScroll))
        }

        this.scrollOffset = lerp(this.scrollOffset,this.targetScrollOffset,this.scrollSmoothness)

        this.elements.forEach((element: Element) => {
            if(element instanceof WorkCard){
                element.scrollOffset = this.scrollOffset;
            }
            if (element.animated) {
                element.update(delta);
            } else if (element.interactive) {
                element.update(delta, mousePos, false);
            }
        });

        this.draw(uiContext, backgroundContext, opacity);
    }

    destroy(): void {
    }
}
