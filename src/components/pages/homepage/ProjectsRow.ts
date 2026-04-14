import { Color, MathUtils } from "three";

import { ProjectCard } from "../projects/ProjectCard";
import { FadeGradient } from "../../elements/canvas/FadeGradient";
import { RenderConfig } from "../../render/RenderConfig";
import type { Project } from "../../app/contentAssets";
import { DraggableLayer } from "../../elements/core/DraggableLayer";

//-------------------------------
//          WORKS GRID LAYER
//-------------------------------

export class ProjectsRow extends DraggableLayer {
    projects: Project[] = [];

    cards: ProjectCard[] = [];
    cardPadding: number = 10;
    cardCornerRadius: number = 40;
    indentWidth: number;
    gap: number;

    title: string = "MY PROJECTS";
    titleSize: number = 60;
    titlePadding: number = 0;

    private readonly imageAspectRatio: number = 5 / 3;

    constructor(
        projects: Project[],
        x: number,
        y: number,
        cardHeight: number,
        indentWidth: number,
        gap: number,
        goTo: (path: string) => void,
        _isMobile: boolean,
    ) {
        super("works-row", [], x, y, 1, 1, goTo);

        this.projects = projects;

        // Row layout calculations
        this.h = cardHeight;

        this.indentWidth = indentWidth;
        this.gap = gap;

        // Scroll values
        this.isScrollable = true;
        this.isDraggable = true;

        this.placeRow();
        // this.placeTitle();
        this.placeGradient();
    }

    update(_delta: number, yOffset: number): void {
        super.update(_delta, yOffset);
        this.pageOffset = yOffset
        for (const card of this.cards) {
            card.setXOffset(this.xOffset);
            card.setYOffset(yOffset);
        }
    }

    placeGradient(): void {
        const gradientExtension = 2;
        const yPosition =
            this.y -
            gradientExtension / 2;

        const leftGradient = new FadeGradient(
            RenderConfig.bgColor,
            0,
            yPosition,
            this.indentWidth,
            this.h + gradientExtension,
            "left",
        );

        const rightGradient = new FadeGradient(
            RenderConfig.bgColor,
            RenderConfig.gridSize.x - this.indentWidth,
            yPosition,
            this.indentWidth,
            this.h + gradientExtension,
            "right",
        );

        leftGradient.isScrollable = true;
        rightGradient.isScrollable = true;

        this.addElement(leftGradient);
        this.addElement(rightGradient);
    }

    placeRow(): void {
        const imageWidth = Math.floor(this.h * this.imageAspectRatio);

        this.w =
            (imageWidth + this.gap) * this.projects.length +
            this.indentWidth * 2;

        const startX = this.x + this.indentWidth;
        const y = this.y

        this.projects.forEach((project: Project, index) => {
            //Offset
            const x = startX + index * (imageWidth + this.gap);

            // Create work card
            const card = new ProjectCard(
                project,
                x,
                y,
                imageWidth,
                this.h,
                this,
                this.cardPadding,
                this.cardCornerRadius,
                this.goTo,
                "home",
            );

            this.cards.push(card);
            // Add card to the grid
            this.addElement(card);
        });
    }

    destroy(): void {
        this.cards.forEach((c) => c.destroy?.());
        this.cards = [];
        this.projects = [];

        super.destroy();
    }
}
