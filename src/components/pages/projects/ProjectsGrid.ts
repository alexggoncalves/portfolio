import { Vector2 } from "three";

import { ProjectCard } from "./ProjectCard";

import { Layer } from "../../elements/core/Layer";
import { type Project } from "../../app/contentAssets";

//-------------------------------
//          WORKS GRID LAYER
//-------------------------------

export class ProjectsGrid extends Layer {
    projects: Project[] = [];

    x: number;
    y: number;
    private readonly imageAspectRatio: number = 5 / 3;

    gridSize: Vector2 = new Vector2(0);
    cols: number = 0;
    rows: number = 0;
    margin: number;
    gap: number;

    constructor(
        projects: Project[],
        x: number,
        y: number,
        width: number,
        minCardWidth: number,
        maxCardWidth: number,
        margin: number,
        gap: number,
        goTo: (path: string) => void,
        _isMobile: boolean,
    ) {
        super("works_grid", [], goTo);

        this.projects = projects;
        this.x = x;
        this.y = y;
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
        this.rows = Math.ceil(this.projects.length / this.cols);

        // Image size in the ascii grid dimensions
        const availableWidth = this.gridSize.x - (this.cols - 1) * this.gap;
        const imageWidth = availableWidth / this.cols;
        const imageHeight = imageWidth / this.imageAspectRatio;

        // Calculate total grid height
        this.gridSize.y = (imageHeight + this.gap) * this.rows + this.gap;

        this.projects.forEach((project: Project, index) => {
            const col = index % this.cols;
            const row = Math.floor(index / this.cols);

            const x = this.x + this.margin + col * (imageWidth + this.gap);
            const y = this.y + row * (imageHeight + this.gap);

            // Create work card
            const card = new ProjectCard(
                project,
                x,
                y,
                imageWidth,
                imageHeight,
                10,
                40,
                this.goTo,
                "projects",
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

    destroy(): void {
        super.destroy();
        this.projects = [];
    }
}
