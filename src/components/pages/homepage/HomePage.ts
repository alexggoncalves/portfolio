import { Page } from "../../elements/core/Page";
import { Layer } from "../../elements/core/Layer";
import type { Work } from "../../../stores/assetStore";
import { WorksRow } from "./WorksRow";
import { Vector2 } from "three";
import useAsciiStore from "../../../stores/asciiStore";
import useSceneStore from "../../../stores/sceneStore";
import { FadeGradient } from "../../elements/canvas/FadeGradient";
// import { CanvasImage } from "../elements/CanvasImage";

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
        const gridSize = useAsciiStore.getState().gridSize;

        const mainLayer = new Layer("home", []);
        this.layers.push(mainLayer);
        this.pageHeight = gridSize.y;

        const workRow = new WorksRow(
            this.works,
            new Vector2(0, gridSize.y + 6),
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

    disableButtons(): void {
        super.disableButtons();
    }

    destroy(): void {
        super.destroy();
    }
}
