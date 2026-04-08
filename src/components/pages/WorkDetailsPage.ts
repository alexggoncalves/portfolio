import { Vector2, Color } from "three";
import Color4 from "three/src/renderers/common/Color4.js";

import type { Work } from "../../stores/assetStore";

import useAsciiStore from "../../stores/asciiStore";
import useSceneStore from "../../stores/sceneStore";

import { createASCIITitle } from "../../utils/asciiFonts";
import { Page } from "./layout/Page";
import { Layer } from "./layout/Layer";
import { ASCIIBlock } from "../elements/ASCIIBlock";
import { ASCIIButton } from "../elements/ASCIIButton";
import { FadeGradient } from "../elements/FadeGradient";
import { WorkMediaLayout  } from "./layout/WorkMediaLayout";
import useContentStore from "../../stores/assetStore";
import { CanvasText } from "../elements/CanvasText";

export class WorkDetailsPage extends Page {
    work: Work | null = null;
    pageContainer: HTMLElement;

    asciigridSize: Vector2;

    fixedLayer: Layer = new Layer("fixed", []);
    placementPosition: Vector2 = new Vector2(3, 5);
    gradientLayer: Layer = new Layer("gradient", []);

    bgColor: Color;

    constructor(work: Work, goTo: (path: string) => void, isMobile: boolean) {
        super(work.id, isMobile, goTo);
        this.work = work;
        this.goTo = goTo;

        this.asciigridSize = useAsciiStore.getState().gridSize;
        this.fixedLayer.isScrollable = true;

        this.pageContainer = document.createElement("section");
        this.pageContainer.id = "work";

        this.fixedLayer.isScrollable = false;

        const main = document.querySelector("main");
        main?.appendChild(this.pageContainer);

        this.bgColor = useSceneStore.getState().backgroundColor;

        this.init();
    }

    init(): void {
        if (!this.work) return;

        const gridSize = useAsciiStore.getState().gridSize;

        const margin = Math.ceil(gridSize.x * 0.22);
        const layoutWidth = gridSize.x - margin * 2;

        // Create and place scrollable layout layer
        const mediaLayer = new WorkMediaLayout(
            this.work.media,
            new Vector2(margin, 14),
            layoutWidth,
            this.goTo,
            this.pageContainer,
            false,
        );

        this.layers.push(mediaLayer);
        this.pageHeight += mediaLayer.layoutSize.y;

        this.placeFadeGradients();
        this.layers.push(this.gradientLayer);

        // Create and place fixed elements
        this.placeBackButton();
        this.placeTitleAndSubtitle(this.work.title, this.work.subtitle);
        this.placeTags(this.work.tags);
        this.placeDescription();

        this.layers.push(this.fixedLayer);
    }

    placeBackButton() {
        const navigationSource =
            useSceneStore.getState().navigationSource || "work";

        this.fixedLayer.addElement(
            new ASCIIButton(
                "<< Go back to works",
                () => {
                    const backDestination =
                        navigationSource === "work" ? "/work" : "/";
                    this.goTo(backDestination);
                },
                new Vector2(4, 10),
                new Color("white"),
                new Color4(0, 0.4, 0.4, 0),
                "left",
                "top",
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
                new Color4(1, 1, 1, 0),
                "left",
                "bottom",
            ),
        );
        titleElement.isScrollable = false;

        this.placementPosition.y -= 1;
        this.placementPosition.x = titleElement.gridPosition.x + 1;

        const subtitleElement = this.fixedLayer.addElement(
            new ASCIIBlock(
                subtitle,
                this.placementPosition.clone(),
                new Color("white"),
                new Color4(0, 0.4, 0.4, 0),
                "left",
                "bottom",
            ),
        );
        subtitleElement.isScrollable = false;

        this.placementPosition.y += titleElement.gridSize.y + 1;
    }

    placeTags(tags: string[]) {
        const { getTagById } = useContentStore.getState();

        let offsetX = 0;
        const position = this.placementPosition.clone();
        tags.forEach((tag) => {
            const tagColorHex = getTagById(tag)?.color;
            const tagColor = new Color(tagColorHex);

            const tagElement = this.fixedLayer.addElement(
                new ASCIIBlock(
                    " " + tag.toUpperCase() + " ",
                    new Vector2(position.x + offsetX, position.y),
                    new Color("white"),
                    new Color4(tagColor.r, tagColor.g, tagColor.b, 0.7),
                    "left",
                    "bottom",
                ),
            );
            tagElement.isScrollable = false;
            offsetX += tagElement.gridSize.x + 2;
        });

        this.placementPosition.y += 4;
    }

    placeDescription() {
        const textSize: number = 16;
        const textFont: string = "Open Sans";
        const textLineHeight: number = 1.1;
        const textPadding: number = 0;

        this.placementPosition.y += 5;

        this.work?.description.paragraphs.forEach((paragraph) => {
            const textBlock = new CanvasText(
                paragraph,
                textFont,
                textSize,
                400,
                this.placementPosition.clone(),
                50,
                textLineHeight,
                textPadding,
                new Color("white"),
                "left",
                "bottom",
            );

            this.fixedLayer.addElement(textBlock);
            const textHeight = textBlock.getGridSize().y

            this.placementPosition.y += textHeight + 1;

            
        });
    }

    placeFadeGradients() {
        this.fixedLayer.addElement(
            new FadeGradient(
                new Color4(this.bgColor),
                // new Color4("red"),
                new Vector2(0, this.asciigridSize.y),
                new Vector2(this.asciigridSize.x, 16),
                "bottom",
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
