import { Vector2 } from "three";

import { Layer } from "../../PageRenderer/Layer";

import type { Work } from "../../../stores/contentStore";
import { FadeGradient } from "../../PageRenderer/Elements/FadeGradient";

import useSceneStore from "../../../stores/sceneStore";
import useAsciiStore from "../../../stores/asciiStore";

import { Element } from "../../PageRenderer/Element";
import { WorkCard } from "./WorkCard";

//-------------------------------
//          WORKS GRID LAYER
//-------------------------------

export class WorksGrid extends Layer {
    goTo: (path: string) => void;
    parent: HTMLElement;

    works: Work[] = [];

    position: Vector2;
    gridSize: Vector2 = new Vector2(0);
    cols: number;
    rows: number;
    margin: number;
    gap: number;
    private readonly imageAspectRatio: number = 5 / 3;

    constructor(
        works: Work[],
        position: Vector2,
        width: number,
        minCardWidth: number,
        maxCardWidth: number,
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
        this.position = position;
        this.gridSize.x = width;   
        this.margin = margin;
        this.gap = gap;

        // Scroll values
        this.isScrollable = true;

        this.cols = this.calculateGridColumns(width,minCardWidth,maxCardWidth,gap);
        this.rows = Math.ceil(this.works.length / this.cols);

        this.createGrid();
    }

    createGrid(): void {
        // Image size in the ascii grid dimensions
        const imageWidth =
            (this.gridSize.x - (this.cols - 1) * this.gap) / this.cols;
        const imageHeight = Math.floor(imageWidth / this.imageAspectRatio);

        // Calculate total grid height
        this.gridSize.y = (imageHeight + this.gap) * this.rows + this.gap;

        const offset = new Vector2(0, 0);
        this.works.forEach((work: Work, index) => {
            // Offset within the grid
            offset.x = (imageWidth + this.gap) * (index % this.cols);
            offset.y = (imageHeight + this.gap) * Math.floor(index / this.cols);

            // Create work card
            const card = new WorkCard(
                work,
                new Vector2( // Position
                    this.position.x + offset.x + this.margin,
                    this.position.y + offset.y,
                ),
                new Vector2(imageWidth, imageHeight), // Size,
                this.goTo,
                this.parent,
            );

            // Add card to the grid
            this.addElement(card);
        });
    }

    calculateGridColumns(
        gridWidth: number,
        minCardWidth: number,
        maxCardWidth: number,
        gap: number,
    ): number {
        let cols = 1;

        for (let testCols = 1; testCols <= 5; testCols++) {
            const totalGapWidth = gap * (testCols - 1);
            const cardWidth = (gridWidth - totalGapWidth) / testCols;

            if (cardWidth < minCardWidth) {
                cols = Math.max(1, testCols - 1);
                break;
            }

            if (cardWidth >= minCardWidth && cardWidth <= maxCardWidth) {
                cols = testCols;
            }

            if (cardWidth > maxCardWidth) {
                cols = testCols;
            }
        }

        return cols;
    }

    destroy(): void {}
}
