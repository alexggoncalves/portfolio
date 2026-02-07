import { Page } from "../../PageRenderer/Page";
import { Vector2 } from "three";
import type { Work } from "../../../stores/contentStore";

// import { createASCIITitle } from "../../../utils/asciiFonts";
import { WorksGrid } from "./WorksGrid";
import useAsciiStore from "../../../stores/asciiStore";
import { Layer } from "../../PageRenderer/Layer";
import { FadeGradient } from "../../PageRenderer/Elements/FadeGradient";
import useSceneStore from "../../../stores/sceneStore";

export class WorkPage extends Page {
    works: Work[] = [];
    worksGrid: WorksGrid | null = null;

    goTo: (path: string) => void;
    pageContainer: HTMLElement;

    private gap: number = 1.2;
    private minCardWidth: number = 18;
    private maxCardWidth: number = 25;
    private marginRatio: number = 0.03;

    constructor(works: Work[], goTo: (path: string) => void) {
        super("work");
        this.works = works;
        this.goTo = goTo;

        const container = document.createElement("div");
        container.id = "work-container";

        this.pageContainer = document.createElement("section");
        this.pageContainer.id = "works";
        const main = document.querySelector("main");
        main?.appendChild(this.pageContainer);
    }

    init(): void {
        const gridSize = useAsciiStore.getState().gridSize;
        const margin = Math.ceil(gridSize.x * this.marginRatio);

        // Place title and filters

        // Place grid of works
        const gridWidth = gridSize.x - margin * 2;
        this.worksGrid = new WorksGrid(
            this.works,
            new Vector2(0, 16), // position
            gridWidth,
            this.minCardWidth,
            this.maxCardWidth,
            margin,
            this.gap,
            this.goTo,
            this.pageContainer,
            false,
        );

        this.setPageHeight(this.worksGrid.gridSize.y + 16);

        this.layers.push(this.worksGrid);
        this.createGradient();
    }

    createGradient(): void {
        const gradientLayer = new Layer("workspage-gradient", []);
        const bgColor = useSceneStore.getState().backgroundColor;
        const gridSize = useAsciiStore.getState().gridSize;

        gradientLayer.addElement(
            new FadeGradient(
                bgColor,
                new Vector2(0, 0),
                new Vector2(gridSize.x, 14),
                "top",
            ),
        );

        this.layers.push(gradientLayer);
    }

    destroy(): void {
        this.pageContainer.remove();
    }
}
