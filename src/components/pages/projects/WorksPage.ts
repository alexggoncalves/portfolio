import { Page } from "../../elements/core/Page";
import { Vector2 } from "three";
import type { Work } from "../../../stores/assetStore";

import { WorksGrid } from "./WorksGrid";
import useAsciiStore from "../../../stores/asciiStore";
import { Layer } from "../../elements/core/Layer";
import { FadeGradient } from "../../elements/canvas/FadeGradient";
import useSceneStore from "../../../stores/sceneStore";

export class WorkPage extends Page {
    works: Work[] = [];
    worksGrid: WorksGrid | null = null;

    private gap: number = 1.2;
    private minCardWidth: number = 18;
    private maxCardWidth: number = 25;
    private marginRatio: number = 0.03;

    constructor(works: Work[], isMobile: boolean, goTo: (path: string) => void) {
        super("works", isMobile, goTo);
        this.works = works;

        this.init();
    }

    init(): void {
        const gridSize = useAsciiStore.getState().gridSize;
        const margin = Math.ceil(gridSize.x * this.marginRatio);

        // filters

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
        super.destroy();
    }
}
