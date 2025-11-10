import { ASCIIPage } from "../ASCIIField/ASCIIPage";
import { ASCIILayer } from "../ASCIIField/ASCIILayer";
import { Vector2, Color } from "three";
import Color4 from "three/src/renderers/common/Color4.js";
import type { Work } from "../../stores/workStore";
import useAsciiStore from "../../stores/asciiStore";

import { ASCIIBlock, ASCIILine } from "../ASCIIField/ASCIIElement/ASCIIElement";
import { ASCIIImage } from "../ASCIIField/ASCIIElement/ASCIIImage";
import { WorkCard } from "./Elements/WorkCard";
import { createASCIITitle } from "../ASCIIField/asciiFonts";

const title = createASCIITitle("WORK")

export class WorkPage extends ASCIIPage {
    works: Work[] = [];
    images: ASCIIImage[] = [];

    asciiCanvasSize: Vector2;
    goTo: (path: string) => void;

    pageContainer: HTMLElement;

    constructor(works: Work[], goTo: (path: string) => void) {
        super("work", []);
        this.works = works;
        this.goTo = goTo;

        const canvasSize = useAsciiStore.getState().canvasSize;
        const charSize = useAsciiStore.getState().charSize;
        this.asciiCanvasSize = new Vector2(
            canvasSize.x / charSize.x,
            canvasSize.y / charSize.y
        );

        const container = document.createElement("div");
        container.id = "work-container";

        this.pageContainer = document.createElement("section");
        this.pageContainer.id = "works";
        const main = document.querySelector("main");
        main?.appendChild(this.pageContainer);
    }

    init(): void {
        // Place title and filters
        const mainLayer = new ASCIILayer("work", []);
        mainLayer.addElement(
            new ASCIIBlock(
                title,
                new Vector2(5, 4),
                new Color("white"),
                new Color4(0, 0.4, 0.4, 0),
                "left",
                "top"
            )
        );

        // FILTERS HERE
        mainLayer.addElement(
            new ASCIIBlock(
                "FILTERS",
                new Vector2(5, 12),
                new Color("white"),
                new Color4(0, 0.4, 0.4, 0),
                "left",
                "top"
            )
        );

        const barXPosition = Math.floor(this.asciiCanvasSize.x / 5);

        // Bar (vertical line)
        mainLayer.addElement(
            new ASCIILine(
                "x",
                new Vector2(barXPosition, 10),
                new Vector2(barXPosition, this.asciiCanvasSize.y - 4),
                1,
                new Color("white"),
                new Color4(0, 0.4, 0.4, 0)
            )
        );

        this.createWorkGrid(this.asciiCanvasSize);

        this.layers.push(mainLayer);
    }

    setWorks(works: Work[]) {
        this.works = works;

        // Place work cards
        this.createWorkGrid(this.asciiCanvasSize);
    }

    // INCOMPLETE
    createWorkGrid(canvasSize: Vector2): void {
        const workGrid = new ASCIILayer("workGrid", []);

        // Grid's top left corner
        const startPosition = new Vector2(Math.floor(canvasSize.x / 5) + 2, 11);

        const offset = new Vector2(0, 0);
        const imageWidth = 18;
        const aspectRatio = 1 / 8;
        const margin = 2;
        // const imageHeight = 9 + 2; // height + title

        this.works.forEach((work: Work, index) => {
            offset.x = (imageWidth + margin) * index;
            offset.y; // Calculate y (!!!)

            const card = new WorkCard(
                work.images[0], // Cover image
                work.title,
                work.id,
                new Vector2( // Position
                    startPosition.x + offset.x,
                    startPosition.y + offset.y
                ),
                new Vector2(imageWidth, imageWidth * aspectRatio), // Size,
                this.goTo,
                this.pageContainer
            );

            this.images.push(card.getImage());

            workGrid.addElement(card);
        });

        this.layers.push(workGrid);
    }

    fadeImagesToAscii(): void {
        this.images.forEach((image: ASCIIImage) => {
            image.fadeToAscii();
        });
    }
    fadeToFullImages(): void {
        this.images.forEach((image: ASCIIImage) => {
            image.fadeToFullImage();
        });
    }

    destroy(): void {
        this.pageContainer.remove();
    }
}
