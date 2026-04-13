import { Page } from "../../elements/core/Page";

import { ProjectsGrid } from "./ProjectsGrid";
import { Layer } from "../../elements/core/Layer";
import { FadeGradient } from "../../elements/canvas/FadeGradient";
import { RenderConfig } from "../../render/RenderConfig";
import type { Project } from "../../app/contentAssets";

export class ProjectPage extends Page {
    projects: Project[] = [];
    worksGrid: ProjectsGrid | null = null;

    private gap: number = 1.2;
    private minCardWidth: number = 18;
    private maxCardWidth: number = 25;
    private marginRatio: number = 0.03;

    constructor(
        projects: Project[],
        isMobile: boolean,
        goTo: (path: string) => void,
    ) {
        super("projects", isMobile, goTo);
        this.projects = projects;

        this.init();
    }

    init(): void {
        const gridSize = RenderConfig.gridSize;
        const margin = Math.ceil(gridSize.x * this.marginRatio);

        // filters

        // Place grid of works
        const gridWidth = gridSize.x - margin * 2;

        this.worksGrid = new ProjectsGrid(
            this.projects,
            0,
            16,
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

        gradientLayer.addElement(
            new FadeGradient(
                RenderConfig.bgColor,
                0,
                0,
                RenderConfig.gridSize.x,
                14,
                "top",
            ),
        );

        this.layers.push(gradientLayer);
    }

    destroy(): void {
        this.worksGrid?.destroy();
        this.projects = null as any;

        super.destroy();
    }
}
