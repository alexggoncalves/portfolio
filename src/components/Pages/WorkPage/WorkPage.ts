import { Page } from "../../PageRenderer/Page";
import { Layer } from "../../PageRenderer/Layer";
import { Vector2, Color } from "three";
import Color4 from "three/src/renderers/common/Color4.js";
import type { Work } from "../../../stores/contentStore";

import { ASCIIBlock } from "../../PageRenderer/Elements/Element";
import { createASCIITitle } from "../../../helpers/asciiFonts";
import { WorksGrid } from "./WorksGrid";
import useAsciiStore from "../../../stores/asciiStore";

const title = createASCIITitle("WORK");

export class WorkPage extends Page {
    works: Work[] = [];
    workGrid: WorksGrid | null = null;

    goTo: (path: string) => void;
    pageContainer: HTMLElement;

    constructor(works: Work[], goTo: (path: string) => void) {
        super("work", []);
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
        const uiResolution = useAsciiStore.getState().uiResolution;
        const margin = Math.ceil(uiResolution.x * 0.05);

        // Place title and filters
        const mainLayer = new Layer("work", []);
        mainLayer.addElement(
            new ASCIIBlock(
                title,
                new Vector2(margin, 3),
                new Color("white"),
                new Color4(0, 0.4, 0.4, 0),
                "left",
                "top"
            )
        );
        this.layers.push(mainLayer);

        // Place grid of works
        
        const gap = 1.2;
        const gridWidth = uiResolution.x - margin * 2;

        const cols = this.calculateGridColumns(gridWidth,18,25,gap)

        this.workGrid = new WorksGrid(
            this.works,
            new Vector2(0, 0), // position
            gridWidth,
            cols,
            margin,
            gap,
            this.goTo,
            this.pageContainer,
            false
        );
        this.layers.push(this.workGrid);
    }

    calculateGridColumns(
        gridWidth: number,
        minCardWidth: number,
        maxCardWidth: number,
        gap: number,
    ):number {
        let cols = 1

        for(let testCols = 1; testCols <= 5;testCols++){
            const totalGapWidth = gap * (testCols-1)
            const cardWidth = (gridWidth-totalGapWidth)/testCols;

            if(cardWidth < minCardWidth){
                cols = Math.max(1,testCols - 1)
                break;
            } 
            
            if( cardWidth >= minCardWidth && cardWidth <= maxCardWidth){
                cols = testCols;
            }

            if(cardWidth > maxCardWidth){
                cols = testCols;
            }
        }

        return cols;
    }

    destroy(): void {
        this.pageContainer.remove();
    }
}
