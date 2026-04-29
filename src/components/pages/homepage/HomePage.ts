import { Page } from "../../elements/core/Page";
import { Layer } from "../../elements/core/Layer";
import { ProjectsRow } from "./ProjectsRow";
import { FadeGradient } from "../../elements/canvas/FadeGradient";
import { AsciiRenderConfig } from "../../app/AsciiRenderConfig";
import type { Project } from "../../assets/contentAssets";
import { CanvasText } from "../../elements/canvas/CanvasText";

export class HomePage extends Page {
    projects: Project[] = [];

    constructor(
        projects: Project[],
        goTo: (path: string) => void,
    ) {
        super("home", goTo);
        this.projects = projects;
        this.init();
    }

    init(): void {
        const mainLayer = new Layer("home", []);
        this.layers.push(mainLayer);

        this.pageHeight = AsciiRenderConfig.gridSize.y;

        this.placeWorksRow();

        this.createGradient();
    }

    placeWorksRow(): void {
        const y = AsciiRenderConfig.gridSize.y - 12;
        const indent = 5;
        const cardHeight = 20;
        const gap = 1;
        const titleSize = 3;
        const titlePadding = 1;

        const workRow = new ProjectsRow(
            this.projects,
            0,
            y + titleSize + titlePadding,
            cardHeight,
            indent,
            gap,
            this.goTo
        );

        const title = new CanvasText(
            indent,
            y,
            "MY PROJECTS",
            "Space Grotesk",
            34,
            600,
            100,
            1,
            0,
            "white",
        );

        workRow.addElement(title);

        this.pageHeight += workRow.h;
        this.layers.push(workRow);

        this.pageHeight += 40;

        title.name = "works-row-title";
    }
    createGradient(): void {
        const gradientLayer = new Layer("gradient", []);

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

    disableButtons(): void {
        super.disableButtons();
    }

    onResize(): void {
        this.layers.forEach((layer) => layer.destroy?.());
        this.layers = [];

        this.init();
    }

    destroy(): void {
        this.projects = [];
        super.destroy();
    }
}
