import { Color, Vector2 } from "three";

import { Layer } from "./Layer";

import type { Work } from "../../../stores/contentStore";
import { WorkCard } from "./WorkCard";
import { CanvasText } from "../../elements/CanvasText";

//-------------------------------
//          WORKS GRID LAYER
//-------------------------------

export class WorksRow extends Layer {
    works: Work[] = [];
    parent: HTMLElement;

    position: Vector2;
    size: Vector2 = new Vector2(0);

    cardHeight: number;
    indentWidth: number;
    gap: number;

    title: string = "Featured projects"
    titleSize: number = 60;
    titlePadding: number = 2;

    private readonly imageAspectRatio: number = 5 / 3;

    constructor(
        works: Work[],
        position: Vector2,
        cardHeight: number,
        indentWidth: number,
        gap: number,
        goTo: (path: string) => void,
        parent: HTMLElement,
        _isMobile: boolean,
    ) {
        super("works-row", [], goTo);

        this.parent = parent;
        this.works = works;
        this.position = position;
        this.cardHeight = cardHeight

        // Row layout calculations
        this.size.y = cardHeight + this.titlePadding * 2 + this.titleSize;

        this.indentWidth = indentWidth;
        this.gap = gap;

        // Scroll values
        this.isScrollable = true;

        
        this.createRow();
        this.createTitle();
    }

    createTitle(): void {
        const title = new CanvasText(
            this.title,
            "",
            this.titleSize,
            new Vector2(this.position.x + this.indentWidth, this.position.y + this.titlePadding),
            100,
            1,
            this.titlePadding,
            new Color("white"),
        );
        this.addElement(title);
    }

    createRow(): void {
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
                    this.position.y + this.titleSize/16 + this.titlePadding * 2,
                ),
                new Vector2(imageWidth, this.cardHeight), // Size,
                "home",
                this.goTo,
                this.parent,
            );

            // Add card to the grid
            this.addElement(card);
        });
    }
}
