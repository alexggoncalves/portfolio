import { Color, MathUtils, Vector2 } from "three";

import { Layer } from "../../elements/core/Layer";

import type { Work } from "../../../stores/assetStore";
import { WorkCard } from "../projects/WorkCard";
import { CanvasText } from "../../elements/canvas/CanvasText";
import { FadeGradient } from "../../elements/canvas/FadeGradient";
import usePointerStore from "../../../stores/pointerStore";
import { RenderConfig } from "../../render/RenderConfig";

//-------------------------------
//          WORKS GRID LAYER
//-------------------------------

export class WorksRow extends Layer {
    works: Work[] = [];

    position: Vector2;
    size: Vector2 = new Vector2(0);
    horizontalOffset: number = 0;

    cards: WorkCard[] = [];
    cardHeight: number;
    cardPadding: number = 10;
    cardCornerRadius: number = 40;
    indentWidth: number;
    gap: number;

    title: string = "MY PROJECTS";
    titleSize: number = 60;
    titlePadding: number = 0;

    private readonly imageAspectRatio: number = 5 / 3;

    isMouseDown: boolean = false;
    mousePosition: Vector2 = new Vector2(-1);
    dragStartX: number = 0;
    dragLastX: number = 0;
    velocity: number = 0;
    decay: number = 0.95;

    setIsDraggingHorizontally: (isDragging: boolean)=>void;

    constructor(
        works: Work[],
        position: Vector2,
        cardHeight: number,
        indentWidth: number,
        gap: number,
        goTo: (path: string) => void,
        _isMobile: boolean,
    ) {
        super("works-row", [], goTo);

        this.works = works;
        this.position = position;
        this.cardHeight = cardHeight;

        this.setIsDraggingHorizontally = usePointerStore.getState().setIsDraggingHorizontally;

        // Row layout calculations
        this.size.y = cardHeight + this.titlePadding * 2 + this.titleSize;

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

        const maxOffset = Math.max(0, this.size.x - RenderConfig.gridSize.x);

        if (this.isMouseDown && this.mousePosition.x >= 0) {
            const deltaX = this.mousePosition.x - this.dragLastX;

            this.horizontalOffset -= deltaX / RenderConfig.charSize.x;
            this.dragLastX = this.mousePosition.x;
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

    updateDragState(isMouseDown: boolean, mousePosition: Vector2): void {
        if (this.contains(mousePosition) && isMouseDown) {
            if (!this.isMouseDown) {
                this.dragStartX = this.horizontalOffset;
                this.dragLastX = mousePosition.x;
            }
            this.isMouseDown = true;
            this.mousePosition = mousePosition.clone();
        } else {
            this.isMouseDown = false;
            this.mousePosition = new Vector2(-1);
        }
    }

    placeGradient(): void {
        const gradientExtension = 2;
        const yPosition =
            this.position.y +
            this.titleSize / 16 +
            this.titlePadding * 2 -
            gradientExtension / 2;

        const leftGradient = new FadeGradient(
            RenderConfig.bgColor,
            // new Color4("white"),
            new Vector2(0, yPosition),
            new Vector2(this.indentWidth, this.cardHeight + gradientExtension),
            "left",
        );

        const rightGradient = new FadeGradient(
            RenderConfig.bgColor,
            // new Color4("white"),
            new Vector2(RenderConfig.gridSize.x - this.indentWidth, yPosition),
            new Vector2(this.indentWidth, this.cardHeight + gradientExtension),
            "right",
        );

        leftGradient.isScrollable = true;
        rightGradient.isScrollable = true;

        this.addElement(leftGradient);
        this.addElement(rightGradient);
    }

    placeTitle(): void {
        const title = new CanvasText(
            this.title,
            "Space Grotesk",
            34,
            600,
            new Vector2(
                this.position.x + this.indentWidth,
                this.position.y + this.titlePadding,
            ),
            100,
            1,
            this.titlePadding,
            new Color("white"),
        );
        this.addElement(title);

        title.name = "works-row-title";
    }

    contains(point: Vector2): boolean {
        if (!this.cards[0]) return false;

        const top = this.cards[0].pixelPosition.y - this.cards[0].pixelOffset.y;
        const bottom = top + this.cards[0].pixelSize.y;

        return point.y > top && point.y < bottom;
    }

    placeRow(): void {
        const imageWidth = Math.floor(this.cardHeight * this.imageAspectRatio);

        this.size.x =
            (imageWidth + this.gap) * this.works.length + this.indentWidth * 2;

        this.works.forEach((work: Work, index) => {
            //Offset
            const offset = (imageWidth + this.gap) * index;

            // Create work card
            const card = new WorkCard(
                work,
                new Vector2( // Position
                    this.position.x + offset + this.indentWidth,
                    this.position.y +
                        this.titleSize / 16 +
                        this.titlePadding * 2,
                ),
                new Vector2(imageWidth, this.cardHeight), // Size,
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

        super.destroy();
    }
}
