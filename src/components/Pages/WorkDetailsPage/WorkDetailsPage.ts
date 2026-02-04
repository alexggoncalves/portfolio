import { Vector2, Color } from "three";
import Color4 from "three/src/renderers/common/Color4.js";

import type { Work } from "../../../stores/contentStore";

import useAsciiStore from "../../../stores/asciiStore";
import useSceneStore from "../../../stores/sceneStore";

import { createASCIITitle } from "../../../utils/asciiFonts";
import { Page } from "../../PageRenderer/Page";
import { Layer } from "../../PageRenderer/Layer";
import { ASCIIBlock } from "../../PageRenderer/Element";
import { ASCIIButton } from "../../PageRenderer/Elements/ASCIIButton";
import { FadeGradient } from "../../PageRenderer/Elements/FadeGradient";
import { WorkLayoutLayer } from "./WorkLayoutLayer";

export class WorkDetailsPage extends Page {
    work: Work | null = null;
    pageContainer: HTMLElement;

    asciigridSize: Vector2;
    goTo: (path: string) => void;

    fixedLayer: Layer = new Layer("fixed", []);
    placementPosition: Vector2 = new Vector2(6, 4);

    constructor(work: Work, goTo: (path: string) => void) {
        super("work", []);
        this.work = work;
        this.goTo = goTo;

        // const bgResolution = useAsciiStore.getState().backgroundResolution;
        // const charSize = useAsciiStore.getState().charSize;

        this.asciigridSize = useAsciiStore.getState().gridSize;

        this.pageContainer = document.createElement("section");
        this.pageContainer.id = "work";

        const main = document.querySelector("main");
        main?.appendChild(this.pageContainer);

        
    }

    init(_isMobile: boolean): void {
        if (!this.work) return;

        // Create and place scrollable layout layer
        const layoutLayer = new WorkLayoutLayer(
            this.work.layout,
            this.placementPosition.clone(),
            this.goTo,
            this.pageContainer,
            false,
        );

        this.layers.push(layoutLayer);

        // Create and place fixed elements
        this.placeFadeGradients();
        this.placeBackButton();
        this.placeTitleAndSubtitle(this.work.title, this.work.subtitle);
        this.placeTags(this.work.tags);
        

        this.layers.push(this.fixedLayer);
    }

    placeBackButton() {
        this.fixedLayer.addElement(
            new ASCIIButton(
                "<< Go back to works",
                () => this.goTo("/work"),
                new Vector2(6, -4),
                new Color("white"),
                new Color4(0, 0.4, 0.4, 0),
                "left",
                "bottom",
                this.pageContainer,
            ),
        );
    }

    placeTitleAndSubtitle(title: string, subtitle: string) {
        const asciiTitle = createASCIITitle(title);

        const titleElement = this.fixedLayer.addElement(
            new ASCIIBlock(
                asciiTitle,
                this.placementPosition.clone(),
                new Color(1, 1, 1),
                new Color4(1, 1, 1, 0.1),
                "left",
                "top",
            ),
        );
        this.placementPosition.y += titleElement.size.y + 1;

        this.fixedLayer.addElement(
            new ASCIIBlock(
                subtitle.toLocaleUpperCase(),
                this.placementPosition.clone(),
                new Color("white"),
                new Color4(0, 0.4, 0.4, 0),
                "left",
                "top",
            ),
        );
        this.placementPosition.y += 2;
    }

    placeTags(tags: string[]) {
        const tagsLayer = new Layer("collaborators", []);
        const tagsContainer = document.createElement("div");

        let offsetX = 0;
        const position = this.placementPosition.clone();

        tags.forEach((tag) => {
            const tagElement = tagsLayer.addElement(
                new ASCIIBlock(
                    " " + tag + " ",
                    new Vector2(position.x + offsetX, position.y),
                    new Color("white"),
                    new Color4(1, 0, 0, 1),
                    "left",
                    "top",
                ),
            );
            offsetX += tagElement.size.x + 2;
        });

        this.layers.push(tagsLayer);
        this.pageContainer.append(tagsContainer);

        this.placementPosition.y += 4
    }

    placeFadeGradients() {
        const bgColor = useSceneStore.getState().backgroundColor;

        this.fixedLayer.addElement(
            new FadeGradient(
                new Color(bgColor),
                new Vector2(0, 10),
                new Vector2(this.asciigridSize.x, 6),
                "top",
            ),
        );
    }

    // placeTeam(
    //     team: TeamMember[],
    //     position: Vector2,
    //     cardSize: Vector2,
    //     isMobile: boolean,
    // ) {
    //     const teamLayer = new Layer("team", []);
    //     const teamContainer = document.createElement("div");

    //     let offsetX = 1;
    //     const margin = 2;

    //     let frameWidth = offsetX;

    //     team.forEach((teamMember, index) => {
    //         const teamMemberCard = new TeamMemberCard(
    //             teamMember,
    //             new Vector2(position.x + offsetX, position.y + 2),
    //             cardSize,
    //             new Color(1, 1, 1),
    //             this.goTo,
    //             this.teamContainer,
    //             isMobile,
    //         );

    //         this.layers.push(teamMemberCard);

    //         if (index < team.length - 1) frameWidth += cardSize.x + margin;
    //         else frameWidth += teamMemberCard.size.x + 1;

    //         offsetX += cardSize.x + 2;
    //     });

    //     teamLayer.addElement(
    //         new ASCIITitleFrame(
    //             "=",
    //             "TEAM",
    //             position,
    //             new Vector2(frameWidth, cardSize.y + 3),
    //             new Color(1, 1, 1),
    //             new Color4(0, 0, 0, 0),
    //         ),
    //     );

    //     this.layers.push(teamLayer);
    //     this.pageContainer.append(teamContainer);
    // }

    destroy(): void {
        this.pageContainer.remove();
    }
}
