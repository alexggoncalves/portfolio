import { Color, MathUtils } from "three";

import { Layer } from "../../elements/core/Layer";

import { ProjectCard } from "../projects/ProjectCard";
import { CanvasText } from "../../elements/canvas/CanvasText";
import { FadeGradient } from "../../elements/canvas/FadeGradient";
import usePointerStore from "../../../stores/pointerStore";
import { RenderConfig } from "../../render/RenderConfig";
import type { Project } from "../../app/contentAssets";

//-------------------------------
//          WORKS GRID LAYER
//-------------------------------

export class ProjectsRow extends Layer {
    projects: Project[] = [];

    x: number;
    y: number;
    w: number = 0;
    h: number;

    horizontalOffset: number = 0;

    cards: ProjectCard[] = [];
    cardHeight: number;
    cardPadding: number = 10;
    cardCornerRadius: number = 40;
    indentWidth: number;
    gap: number;

    title: string = "MY PROJECTS";
    titleSize: number = 60;
    titlePadding: number = 0;

    private readonly imageAspectRatio: number = 5 / 3;

    // Draggin state
    mouseX: number = -1;
    mouseY: number = -1;
    dragStartX: number = 0;
    dragLastX: number = 0;
    velocity: number = 0;
    decay: number = 0.95;
    isMouseDown: boolean = false;

    setIsDraggingHorizontally: (isDragging: boolean) => void;

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
        super("works-row", [], goTo);

        this.projects = projects;
        this.x = x;
        this.y = y;

        this.cardHeight = cardHeight;

        this.setIsDraggingHorizontally =
            usePointerStore.getState().setIsDraggingHorizontally;

        // Row layout calculations
        this.h = cardHeight + this.titlePadding * 2 + this.titleSize / 16;

        this.indentWidth = indentWidth;
        this.gap = gap;

        // Scroll values
        this.isScrollable = true;
        this.isDraggable = true;

        this.placeRow();
        this.placeTitle();
        this.placeGradient();
    }

    update(_delta: number, yOffset: number): void {
        const maxOffset = Math.max(0, this.w - RenderConfig.gridSize.x);

        if (this.isMouseDown && this.mouseX >= 0) {
            const deltaX = this.mouseX - this.dragLastX;

            this.horizontalOffset -= deltaX / RenderConfig.charSize.x;

            this.dragLastX = this.mouseX;
            this.velocity = -deltaX / RenderConfig.charSize.x;

            this.horizontalOffset = MathUtils.clamp(
                this.horizontalOffset,
                0,
                maxOffset,
            );
            this.setIsDraggingHorizontally(true);
        } else {
            // Apply decay to velocity when not dragging
            if (Math.abs(this.velocity) > 0.01) {
                this.horizontalOffset += this.velocity;

                if (
                    this.horizontalOffset < 0 ||
                    this.horizontalOffset > maxOffset
                ) {
                    // bounce back if we hit the edge
                    this.horizontalOffset = MathUtils.clamp(
                        this.horizontalOffset,
                        0,
                        maxOffset,
                    );
                    this.velocity = 0;
                }

                this.velocity *= this.decay;
            } else {
                this.velocity = 0;
            }
            this.setIsDraggingHorizontally(false);
        }

        for (const card of this.cards) {
            card.setXOffset(this.horizontalOffset);
            card.setYOffset(yOffset);
        }
        super.update(_delta, yOffset);
    }

    updateDragState(
        mouseX: number,
        mouseY: number,
        isMouseDown: boolean,
    ): void {
        if (this.contains(mouseX, mouseY) && isMouseDown) {
            if (!this.isMouseDown) {
                this.dragStartX = this.horizontalOffset;
                this.dragLastX = mouseX;
            }
            this.isMouseDown = true;
            this.mouseX = mouseX;
            this.mouseY = mouseY;
        } else {
            this.isMouseDown = false;
            this.mouseX = -1;
            this.mouseY = -1;
        }
    }

    placeGradient(): void {
        const gradientExtension = 2;
        const yPosition =
            this.y +
            this.titleSize / 16 +
            this.titlePadding * 2 -
            gradientExtension / 2;

        const leftGradient = new FadeGradient(
            RenderConfig.bgColor,
            0,
            yPosition,
            this.indentWidth,
            this.cardHeight + gradientExtension,
            "left",
        );

        const rightGradient = new FadeGradient(
            RenderConfig.bgColor,
            RenderConfig.gridSize.x - this.indentWidth,
            yPosition,
            this.indentWidth,
            this.cardHeight + gradientExtension,
            "right",
        );

        leftGradient.isScrollable = true;
        rightGradient.isScrollable = true;

        this.addElement(leftGradient);
        this.addElement(rightGradient);
    }

    placeTitle(): void {
        const title = new CanvasText(
            this.x + this.indentWidth,
            this.y + this.titlePadding,
            this.title,
            "Space Grotesk",
            34,
            600,
            100,
            1,
            this.titlePadding,
            new Color("white"),
        );
        this.addElement(title);

        title.name = "works-row-title";
    }

    contains(_x: number, y: number): boolean {
        if (!this.cards[0]) return false;

        const top = this.cards[0].y - this.cards[0].offsetY;
        const bottom = top + this.cards[0].h;

        return y > top && y < bottom;
    }

    placeRow(): void {
        const imageWidth = Math.floor(this.cardHeight * this.imageAspectRatio);

        this.w =
            (imageWidth + this.gap) * this.projects.length +
            this.indentWidth * 2;

        const startX = this.x + this.indentWidth;
        const y = this.y + this.titleSize / 16 + this.titlePadding * 2;

        this.projects.forEach((project: Project, index) => {
            //Offset
            const x = startX + index * (imageWidth + this.gap);


            // Create work card
            const card = new ProjectCard(
                project,
                x,
                y,
                imageWidth,
                this.cardHeight,
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
