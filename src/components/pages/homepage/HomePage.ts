import { Page } from "../../elements/core/Page";
import { Layer } from "../../elements/core/Layer";
import { ProjectsRow } from "./ProjectsRow";
import { FadeGradient } from "../../elements/canvas/FadeGradient";
import { RenderConfig } from "../../render/RenderConfig";
import type { Project } from "../../app/contentAssets";

export class HomePage extends Page {
    projects: Project[] = [];

    constructor(
        projects: Project[],
        isMobile: boolean,
        goTo: (path: string) => void,
    ) {
        super("home", isMobile, goTo);
        this.projects = projects;
        this.init();
    }

    init(): void {
        const mainLayer = new Layer("home", []);
        this.layers.push(mainLayer);

        this.pageHeight = RenderConfig.gridSize.y;

        const workRow = new ProjectsRow(
            this.projects,
            0,
            RenderConfig.gridSize.y -12,
            20,
            5,
            1,
            this.goTo,
            this.isMobile,
        );

        this.pageHeight += workRow.h;
        this.layers.push(workRow);

        this.pageHeight += 40;

        this.createGradient();
    }

    createGradient(): void {
        const gradientLayer = new Layer("gradient", []);

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

    disableButtons(): void {
        super.disableButtons();
    }

    destroy(): void {
        super.destroy();
    }
}
