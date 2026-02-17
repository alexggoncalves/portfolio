import { Vector2 } from "three";

import type { Work } from "../../../stores/contentStore";
import { WorkCard } from "./WorkCard";

import { Layer } from "./Layer";

//-------------------------------
//          WORKS GRID LAYER
//-------------------------------

export class WorksGrid extends Layer {
    works: Work[] = [];

    position: Vector2;
    private readonly imageAspectRatio: number = 5 / 3;

    gridSize: Vector2 = new Vector2(0);
    cols: number = 0;
    rows: number = 0;
    margin: number;
    gap: number;

    constructor(
        works: Work[],
        position: Vector2,
        width: number,
        minCardWidth: number,
        maxCardWidth: number,
        margin: number,
        gap: number,
        goTo: (path: string) => void,
        _isMobile: boolean,
    ) {
        super("works_grid", [], goTo);

        this.works = works;
        this.position = position;
        this.gridSize.x = width;
        this.margin = margin;
        this.gap = gap;

        // Scroll values
        this.isScrollable = true;

        // Create grid
        this.createGrid(width, minCardWidth, maxCardWidth, gap);
    }

    createGrid(
        width: number,
        minCardW: number,
        maxCardW: number,
        gap: number,
    ): void {
        // Calculate columns and rows
        this.cols = this.calculateGridColumns(width, minCardW, maxCardW, gap);
        console.log(this.cols)
        this.rows = Math.ceil(this.works.length / this.cols);

        // Image size in the ascii grid dimensions
        const availableWidth = this.gridSize.x - (this.cols - 1) * this.gap;
        const imageWidth = availableWidth / this.cols;
        const imageHeight = imageWidth / this.imageAspectRatio;

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
                "work",
                
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
