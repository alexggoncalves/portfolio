import { Page } from "../../elements/core/Page";
import { Layer } from "../../elements/core/Layer";
import type { Work } from "../../../stores/assetStore";
import { WorksRow } from "./WorksRow";
import { Vector2 } from "three";
import { FadeGradient } from "../../elements/canvas/FadeGradient";
import { RenderConfig } from "../../render/RenderConfig";

export class HomePage extends Page {
    works: Work[] = [];

    constructor(
        works: Work[],
        isMobile: boolean,
        goTo: (path: string) => void,
    ) {
        super("home", isMobile, goTo);
        this.works = works;
        this.init();
    }

    init(): void {
        const mainLayer = new Layer("home", []);
        this.layers.push(mainLayer);

        this.pageHeight = RenderConfig.gridSize.y;

        const workRow = new WorksRow(
            this.works,
            new Vector2(0, RenderConfig.gridSize.y + 6),
            20,
            5,
            1,
            this.goTo,
            this.isMobile,
        );

        this.pageHeight += workRow.size.y;
        this.layers.push(workRow);

        this.pageHeight += 40;

        this.createGradient();
    }

    createGradient(): void {
        const gradientLayer = new Layer("gradient", []);

        gradientLayer.addElement(
            new FadeGradient(
                RenderConfig.bgColor,
                new Vector2(0, 0),
                new Vector2(RenderConfig.gridSize.x, 14),
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
