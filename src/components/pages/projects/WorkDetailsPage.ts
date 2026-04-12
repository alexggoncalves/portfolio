import { Vector2, Color } from "three";
import Color4 from "three/src/renderers/common/Color4.js";

import type {
    MediaBlock,
    TeamMember,
    TextBlock,
    Work,
} from "../../../stores/assetStore";


import { createASCIITitle } from "../../../utils/asciiFonts";
import { Page } from "../../elements/core/Page";
import { Layer } from "../../elements/core/Layer";
import { AsciiBlock } from "../../elements/ascii/AsciiBlock";
import { AsciiButton } from "../../elements/ascii/AsciiButton";
import { FadeGradient } from "../../elements/canvas/FadeGradient";
import { MediaLayout } from "./MediaLayout";
import useContentStore from "../../../stores/assetStore";
import { CanvasText } from "../../elements/canvas/CanvasText";
import { CanvasImage } from "../../elements/canvas/CanvasImage";
import useAssetStore from "../../../stores/assetStore";
import { RenderConfig } from "../../render/RenderConfig";
import { AppState } from "../../render/AppState";

export class WorkDetailsPage extends Page {
    work: Work | null = null;

    asciigridSize: Vector2;

    fixedLayer: Layer = new Layer("fixed", []);
    placementPosition: Vector2 = new Vector2(0);

    titleElement: AsciiBlock | null = null;
    subtitleElement: AsciiBlock | null = null;

    textSize: number = 16;
    textFont: string = "Open Sans";
    textLineHeight: number = 1.1;
    textPadding: number = 0;
    textColor: Color = new Color("white");

    toolIconsHeight = 3;

    bgColor: Color;

    constructor(work: Work, goTo: (path: string) => void, isMobile: boolean) {
        super(work.id, isMobile, goTo);
        this.work = work;
        this.goTo = goTo;

        this.asciigridSize = RenderConfig.gridSize;
        this.fixedLayer.isScrollable = true;
        this.placementPosition.set(4, this.asciigridSize.y - 2);

        this.fixedLayer.isScrollable = false;

        this.bgColor = RenderConfig.bgColor;

        this.init();
    }

    init(): void {
        if (!this.work) return;

        // Place media layout
        this.placeMediaLayout(this.work.media);

        // Place gradients on top of media layer
        this.placeFadeGradients();

        // Create and place fixed elements aligned to the bottom
        this.placeTeam(this.work.team);
        this.placeTools(this.work.tools);
        this.placeDescription(this.work.description);

        // Create and place fixed elements
        this.placeBackButton();

        // Create title and subtitle elements
        this.createTitleAndSubtitle(this.work.title, this.work.subtitle);
        // Add title and subtitle to fixed layer (on top of gradients)
        this.fixedLayer.addElement(this.subtitleElement!);
        this.fixedLayer.addElement(this.titleElement!);

        this.placeTags(this.work.tags);

        // Add fixed layer on top of everything
        this.layers.push(this.fixedLayer);
    }

    placeTools(tools: string[]) {
        const getIconById = useAssetStore.getState().getIconById;

        if (!this.work || !this.work.tools) return;

        this.placementPosition.y -= this.toolIconsHeight;

        let placedIcons = 0;
        const pos = this.placementPosition.clone();

        tools.forEach((tool) => {
            const icon = getIconById(tool);

            if (icon?.src) {
                const toolImage = new CanvasImage(
                    icon.src,
                    pos.clone(),
                    this.toolIconsHeight * icon.aspect,
                    this.toolIconsHeight,
                );
                this.fixedLayer.addElement(toolImage);
                pos.x += toolImage.gridSize.x + 1;

                placedIcons++;
            }
        });

        pos.y -= 1;
        pos.x = this.placementPosition.x;

        const title = new AsciiBlock(
            "BUILT WITH:",
            pos,
            this.textColor,
            new Color4(0, 0, 0, 0),
            "left",
            "top",
        );

        this.placementPosition.y -= 1 + this.toolIconsHeight + 2;

        if (placedIcons > 0) this.fixedLayer.addElement(title);
    }

    placeMediaLayout(media: MediaBlock[]): void {
        const gridSize = RenderConfig.gridSize;

        const margin = Math.ceil(gridSize.x * 0.26);
        const layoutWidth = gridSize.x - margin * 2;

        // Create and place scrollable layout layer
        const mediaLayer = new MediaLayout(
            media,
            new Vector2(72, 14),
            layoutWidth,
            this.goTo,
            false,
        );

        // Add the media layer below everything
        this.layers.push(mediaLayer);
        this.pageHeight += mediaLayer.layoutSize.y;
    }

    placeBackButton() {
        const navigationSource = AppState.navigationSource;

        this.fixedLayer.addElement(
            new AsciiButton(
                "<< Go back",
                () => {
                    const backDestination =
                        navigationSource === "home" ? "/" : "/projects";
                    this.goTo(backDestination);
                },
                new Vector2(4, 10),
                this.textColor,
                new Color4(0, 0.4, 0.4, 0),
                "left",
                "top",
            ),
        );
    }

    createTitleAndSubtitle(title: string, subtitle: string) {
        const asciiTitle = createASCIITitle(title);

        this.subtitleElement = new AsciiBlock(
            subtitle,
            this.placementPosition.clone(),
            this.textColor,
            new Color4(0, 0.4, 0.4, 0),
            "left",
            "top",
        );
        this.subtitleElement.isScrollable = false;

        this.placementPosition.y -= this.subtitleElement.gridSize.y + 3;
        this.placementPosition.x = this.subtitleElement.gridPosition.x - 1;

        this.titleElement = new AsciiBlock(
            asciiTitle,
            this.placementPosition.clone(),
            this.textColor,
            new Color4(1, 1, 1, 0),
            "left",
            "top",
        );

        this.titleElement.isScrollable = false;

        this.placementPosition.y -= 1;
        this.placementPosition.x += 1;
    }

    placeTags(tags: string[]) {
        const { getTagById } = useContentStore.getState();

        let offsetX = 0;
        const position = this.placementPosition.clone();
        tags.forEach((tag) => {
            const tagColorHex = getTagById(tag)?.color;
            const tagColor = new Color(tagColorHex);

            const tagElement = this.fixedLayer.addElement(
                new AsciiBlock(
                    " " + tag.toUpperCase() + " ",
                    new Vector2(position.x + offsetX, position.y),
                    this.textColor,
                    new Color4(tagColor.r, tagColor.g, tagColor.b, 0.7),
                    "left",
                    "top",
                ),
            );
            tagElement.isScrollable = false;
            offsetX += tagElement.gridSize.x + 2;
        });
        this.placementPosition.y += 9;
    }

    placeDescription(description: TextBlock) {
        if (!description) return;

        this.placementPosition.y -= 1;

        description.paragraphs.forEach((paragraph) => {
            const textBlock = new CanvasText(
                paragraph,
                this.textFont,
                this.textSize,
                400,
                this.placementPosition.clone(),
                50,
                this.textLineHeight,
                this.textPadding,
                this.textColor,
                "left",
                "top",
            );

            this.fixedLayer.addElement(textBlock);
            const textHeight = textBlock.getGridSize().y;

            this.placementPosition.y -= Math.ceil(textHeight);
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

        this.fixedLayer.addElement(
            new FadeGradient(
                new Color4(this.bgColor),
                // new Color4("red"),
                new Vector2(0, 0),
                new Vector2(this.asciigridSize.x, 12),
                "top",
            ),
        );
    }

    placeTeam(team?: TeamMember[]) {
        if (!team) return;

        this.placementPosition.y -= 3;

        const getPersonById = useAssetStore.getState().getPersonById;
        const pos = this.placementPosition.clone();
        team.forEach((teamMember) => {
            const person = getPersonById(teamMember.id);
            if (person) {
                const name = person.name.replace(/ /g, "\n");
                const element = new AsciiBlock(
                    name,
                    pos.clone(),
                    this.textColor,
                    new Color4(0, 0, 0, 0),
                    "left",
                    "top",
                );

                this.fixedLayer.addElement(element);
                pos.x += element.gridSize.x + 6;
            }
        });

        pos.x = this.placementPosition.x;

        pos.y -= 2;

        const title = new AsciiBlock(
            "TEAM",
            pos,
            this.textColor,
            new Color4(0, 0, 0, 0),
            "left",
            "top",
        );

        this.placementPosition.y -= 4;

        if (team.length > 0) this.fixedLayer.addElement(title);
    }

    destroy(): void {
        this.fixedLayer.destroy();
        
        super.destroy();
    }
}
