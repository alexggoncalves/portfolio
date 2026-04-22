import { Page } from "../../elements/core/Page";

import { ProjectsGrid } from "./ProjectsGrid";
import { Layer } from "../../elements/core/Layer";
import { FadeGradient } from "../../elements/canvas/FadeGradient";
import { AsciiRenderConfig } from "../../app/AsciiRenderConfig";
import type { Project } from "../../assets/contentAssets";

export class ProjectPage extends Page {
    projects: Project[] = [];
    worksGrid: ProjectsGrid | null = null;

    private gap: number = 1.2;
    private minCardWidth: number = 18;
    private maxCardWidth: number = 25;
    private marginRatio: number = 0.03;

    constructor(
        projects: Project[],
        goTo: (path: string) => void,
    ) {
        super("projects", goTo);
        this.projects = projects;

        this.init();
    }

    init(): void {
        const gridSize = AsciiRenderConfig.gridSize;
        const margin = Math.ceil(gridSize.x * this.marginRatio);

        // filters

        // Place grid of works
        const gridWidth = gridSize.x - margin * 2;

        this.worksGrid = new ProjectsGrid(
            this.projects,
            0,
            12,
            gridWidth,
            this.minCardWidth,
            this.maxCardWidth,
            margin,
            this.gap,
            this.goTo,
            false,
        );

        this.setPageHeight(this.worksGrid.gridSize.y + 12 + margin / 2);

        this.layers.push(this.worksGrid);
        this.createGradient();
    }

    createGradient(): void {
        const gradientLayer = new Layer("workspage-gradient", []);

        gradientLayer.addElement(
            new FadeGradient(
                AsciiRenderConfig.bgColor,
                0,
                0,
                AsciiRenderConfig.gridSize.x,
                14,
                "top",
            ),
        );

        this.layers.push(gradientLayer);
    }

    onResize(): void {
        this.layers.forEach((l) => l.destroy?.());
        this.layers = [];

        this.pageHeight = 0;

        this.worksGrid?.destroy();

        this.init();
    }

    destroy(): void {
        this.worksGrid?.destroy();
        this.projects = null as any;

        super.destroy();
    }
}
