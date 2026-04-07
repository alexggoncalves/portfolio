import { Page } from "./layout/Page";
import { Layer } from "./layout/Layer";
import type { Work } from "../../stores/assetStore";
import { WorksRow } from "./layout/WorksRow";
import { Vector2 } from "three";
import useAsciiStore from "../../stores/asciiStore";
// import { CanvasImage } from "../elements/CanvasImage";

export class HomePage extends Page {
    works: Work[] = [];
    workGrid: WorksRow | null = null;

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
    }

    disableButtons(): void {
        super.disableButtons();
    }
}
