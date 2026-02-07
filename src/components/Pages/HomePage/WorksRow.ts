import { Vector2 } from "three";

import { Layer } from "../../PageRenderer/Layer";

import type { Work } from "../../../stores/contentStore";
import { FadeGradient } from "../../PageRenderer/Elements/FadeGradient";

import useSceneStore from "../../../stores/sceneStore";
import useAsciiStore from "../../../stores/asciiStore";

import { Element } from "../../PageRenderer/Element";
import { WorkCard } from "../Works/WorkCard";

//-------------------------------
//          WORKS GRID LAYER
//-------------------------------

export class WorksRow extends Layer {
    goTo: (path: string) => void;
    parent: HTMLElement;

    works: Work[] = [];

    position: Vector2;
    rowSize: Vector2 = new Vector2(0);

    indentWidth: number;
    gap: number;

    private readonly imageAspectRatio: number = 5 / 3;

    constructor(
        works: Work[],
        position: Vector2,
        height: number,
        indentWidth: number,
        gap: number,
        goTo: (path: string) => void,
        parent: HTMLElement,
        _isMobile: boolean,
    ) {
        super("works-row", []);
        this.goTo = goTo;
        this.parent = parent;
        this.works = works;
        this.position = position;

        // Row layout calculations
        this.rowSize.y = height;
        this.indentWidth = indentWidth;
        this.gap = gap;

        // Scroll values
        this.isScrollable = true;

        this.createRow();
    }

    createRow(): void {
        

        const imageHeight = this.rowSize.y
        const imageWidth = Math.floor(imageHeight * this.imageAspectRatio);
        
        this.rowSize.x = (imageWidth + this.gap) * this.works.length + this.indentWidth * 2

        const gridSize = useAsciiStore.getState().gridSize;
        // this.maxScroll = Math.max(
        //     0,
        //     gridSize.y + this.bottomScrollMargin,
        // );

        this.works.forEach((work: Work, index) => {
            //Offset
            const offset = (imageWidth + this.gap) * index;

            // Create work card
            const card = new WorkCard(
                work,
                new Vector2( // Position
                    this.position.x + offset + this.indentWidth,
                    this.position.y,
                ),
                new Vector2(imageWidth, imageHeight), // Size,
                this.goTo,
                this.parent,
            );

            // Add card to the grid
            this.addElement(card);
        });
    }

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
    }

    destroy(): void {}
}
