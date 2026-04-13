import { Vector2, Color } from "three";
import Color4 from "three/src/renderers/common/Color4.js";

import { createASCIITitle } from "../../../utils/asciiFonts";
import { Page } from "../../elements/core/Page";
import { Layer } from "../../elements/core/Layer";
import { AsciiBlock } from "../../elements/ascii/AsciiBlock";
import { AsciiButton } from "../../elements/ascii/AsciiButton";
import { FadeGradient } from "../../elements/canvas/FadeGradient";
import { MediaLayout } from "./MediaLayout";
import { CanvasText } from "../../elements/canvas/CanvasText";
import { CanvasImage } from "../../elements/canvas/CanvasImage";
import { RenderConfig } from "../../render/RenderConfig";
import { AppState } from "../../app/AppState";
import {
    getIconById,
    getPersonById,
    getTagById,
    type MediaBlock,
    type Project,
    type TeamMember,
    type TextBlock,
} from "../../app/contentAssets";

export class ProjectDetailsPage extends Page {
    project: Project | null = null;

    asciigridSize: Vector2;

    fixedLayer: Layer = new Layer("fixed", []);
    placementX: number = 0;
    placementY: number = 0;

    titleElement: AsciiBlock | null = null;
    subtitleElement: AsciiBlock | null = null;

    textSize: number = 16;
    textFont: string = "Open Sans";
    textLineHeight: number = 1.1;
    textPadding: number = 0;
    textColor: Color = new Color("white");

    toolIconsHeight = 3;

    constructor(
        project: Project,
        goTo: (path: string) => void,
        isMobile: boolean,
    ) {
        super(project.id, isMobile, goTo);
        this.project = project;
        this.goTo = goTo;
        this.asciigridSize = RenderConfig.gridSize;

        this.fixedLayer.isScrollable = false;

        this.placementX = 4;
        this.placementY = this.asciigridSize.y - 2;

        this.init();
    }

    init(): void {
        if (!this.project) return;

        // Place media layout
        this.placeMediaLayout(this.project.media);

        // Place gradients on top of media layer
        this.placeFadeGradients();

        // Create and place fixed elements aligned to the bottom
        this.placeTeam(this.project.team);
        this.placeTools(this.project.tools);
        this.placeDescription(this.project.description);

        // Create title and subtitle elements
        this.createTitleAndSubtitle(this.project.title, this.project.subtitle);
        // Add title and subtitle to fixed layer (on top of gradients)
        this.fixedLayer.addElement(this.subtitleElement!);
        this.fixedLayer.addElement(this.titleElement!);

        // Create and place fixed elements
        this.placeBackButton();

        this.placeTags(this.project.tags);

        // Add fixed layer on top of everything
        this.layers.push(this.fixedLayer);
    }

    placeTeam(team?: TeamMember[]) {
        if (!team) return;

        let x = this.placementX;
        let y = this.placementY - 3;

        team.forEach((teamMember) => {
            const person = getPersonById(teamMember.id);
            if (person) {
                const name = person.name.replace(/ /g, "\n");
                const element = new AsciiBlock(
                    name,
                    x,
                    y,
                    this.textColor,
                    new Color4(0, 0, 0, 0),
                    "left",
                    "top",
                );

                this.fixedLayer.addElement(element);
                x += element.gridW + 6;
            }
        });

        y -= 2;
        x = this.placementX;

        const title = new AsciiBlock(
            "TEAM",
            x,
            y,
            this.textColor,
            new Color4(0, 0, 0, 0),
            "left",
            "top",
        );

        y -= 1;

        if (team.length > 0) {
            this.placementY = y;
            this.fixedLayer.addElement(title);
        }
    }

    placeTools(tools: string[]) {
        if (!this.project || !this.project.tools) return;

        // start at top left corner
        let x = this.placementX;
        let y = this.placementY - this.toolIconsHeight;

        let placedIcons = 0;
        tools.forEach((tool) => {
            const icon = getIconById(tool);
            if (icon?.src) {
                const toolImage = new CanvasImage(
                    icon.src,
                    x,
                    y,
                    this.toolIconsHeight * icon.aspect,
                    this.toolIconsHeight,
                );
                this.fixedLayer.addElement(toolImage);
                x += toolImage.gridW + 1;

                placedIcons++;
            }
        });

        y -= 1; // space for the title
        x = this.placementX; // back to the left

        const title = new AsciiBlock(
            "BUILT WITH:",
            x,
            y,
            this.textColor,
            new Color4(0, 0, 0, 0),
            "left",
            "top",
        );

        y -= title.gridH + 4; // Space under next element

        // Place element if
        if (placedIcons > 0) {
            this.fixedLayer.addElement(title);
            this.placementY = y;
        }
    }

    placeDescription(description: TextBlock) {
        if (!description) return;

        let x = this.placementX;
        let y = this.placementY - 1;

        const paragraphs = description.paragraphs;

        for (let i = paragraphs.length - 1; i >= 0; i--) {
            const textBlock = new CanvasText(
                x,
                y,
                paragraphs[0],
                this.textFont,
                this.textSize,
                400, // Weight
                50, // Max width
                this.textLineHeight,
                this.textPadding,
                this.textColor,
                "left",
                "top",
            );

            this.fixedLayer.addElement(textBlock);

            const textHeight = textBlock.getGridSize().h;

            y -= Math.ceil(textHeight);
        }
        description.paragraphs.forEach((paragraph) => {});

        this.placementY = y;
    }

    createTitleAndSubtitle(title: string, subtitle: string) {
        const asciiTitle = createASCIITitle(title);

        let x = this.placementX;
        let y = this.placementY;

        this.subtitleElement = new AsciiBlock(
            subtitle,
            x,
            y,
            this.textColor,
            new Color4(0, 0.4, 0.4, 0),
            "left",
            "top",
        );
        this.subtitleElement.isScrollable = false;

        x = this.subtitleElement.gridX - 1; // Offset block's x
        y -= this.subtitleElement.gridH + 3; // Space for the title

        this.titleElement = new AsciiBlock(
            asciiTitle,
            x,
            y,
            this.textColor,
            new Color4(1, 1, 1, 0),
            "left",
            "top",
        );
        this.titleElement.isScrollable = false;

        
        this.placementY = y;
    }

    placeTags(tags: string[]) {
        let x = this.placementX;
        let y = this.placementY-1;

        tags.forEach((tag) => {
            const tagColorHex = getTagById(tag)?.color;
            const tagColor = new Color(tagColorHex);

            const tagElement = this.fixedLayer.addElement(
                new AsciiBlock(
                    " " + tag.toUpperCase() + " ",
                    x,
                    y,
                    this.textColor,
                    new Color4(tagColor.r, tagColor.g, tagColor.b, 0.7),
                    "left",
                    "top",
                ),
            );
            tagElement.isScrollable = false;
            x += tagElement.gridW + 2;
        });
    }

    placeMediaLayout(media: MediaBlock[]): void {
        const gridSize = RenderConfig.gridSize;

        const margin = Math.ceil(gridSize.x * 0.26);
        const layoutWidth = gridSize.x - margin * 2;

        // Create and place scrollable layout layer
        const mediaLayer = new MediaLayout(
            media,
            72,
            14,
            layoutWidth,
            this.goTo,
            false,
        );

        // Add the media layer below everything
        this.layers.push(mediaLayer);
        this.pageHeight += mediaLayer.h;
    }

    placeFadeGradients() {
        // Bottom gradient
        this.fixedLayer.addElement(
            new FadeGradient(
                RenderConfig.bgColor,
                0, // x
                RenderConfig.gridSize.y, // y
                RenderConfig.gridSize.x, // w
                8, // h
                "bottom",
            ),
        );

        // Top gradient
        this.fixedLayer.addElement(
            new FadeGradient(
                RenderConfig.bgColor,
                0,
                0,
                RenderConfig.gridSize.x,
                10,
                "top",
            ),
        );
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
                4,
                10,
                this.textColor,
                new Color4(0, 0.4, 0.4, 0),
                "left",
                "top",
            ),
        );
    }

    destroy(): void {
        this.fixedLayer.destroy();
        this.fixedLayer = undefined as any;

        this.project = undefined as any;
        this.titleElement = undefined as any;
        this.subtitleElement = undefined as any;

        super.destroy();
    }
}
