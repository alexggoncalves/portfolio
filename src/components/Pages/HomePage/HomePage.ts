import { Page } from "../../PageRenderer/Page";
import { Layer } from "../../PageRenderer/Layer";
import type { Work } from "../../../stores/contentStore";
import { WorksRow } from "./WorksRow";
import { Vector2 } from "three";
import useAsciiStore from "../../../stores/asciiStore";

export class HomePage extends Page {
    goTo: (path: string) => void;

    works: Work[] = [];
    workGrid: WorksRow | null = null;

    pageContainer: HTMLElement;

    constructor(works: Work[], goTo: (path: string) => void) {
        super("homepage");

        this.works = works;
        this.goTo = goTo;

        this.pageContainer = document.createElement("section");
        this.pageContainer.id = "homepage";
        const main = document.querySelector("main");
        main?.appendChild(this.pageContainer);
    }

    init(isMobile: boolean): void {
        const mainLayer = new Layer("home", []);

        const gridSize = useAsciiStore.getState().gridSize;

        this.pageHeight = gridSize.y

        const workRow = new WorksRow(
            this.works,
            new Vector2(0, gridSize.y),
            20,
            5,
            1,
            this.goTo,
            this.pageContainer,
            isMobile,
        );
        
        this.pageHeight += 24
        
        this.layers.push(workRow);

    }
}
