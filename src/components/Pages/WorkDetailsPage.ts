import { Vector2, Color } from "three";
import Color4 from "three/src/renderers/common/Color4.js";

import type { TeamMember, Work } from "../../stores/contentStore";
import { TeamMemberCard } from "./Layers/TeamMemberCard";

import useMediaViewerStore from "../../stores/mediaViewerStore";
import { MediaViewerLayer } from "./Layers/MediaViewerLayer";

import useAsciiStore from "../../stores/asciiStore";
import { createASCIITitle } from "../../helpers/asciiFonts";
import { Page } from "../PageRenderer/Page";
import { Layer } from "../PageRenderer/Layer";
import { ASCIIBlock } from "../PageRenderer/Elements/Element";
import { ASCIIText } from "../PageRenderer/Elements/ASCIIText";
import { ASCIIButton } from "../PageRenderer/Elements/ASCIIButton";
import { ASCIITitleFrame } from "../PageRenderer/Elements/ASCIIFrame";

export class WorkDetailsPage extends Page {
    work: Work | null = null;
    pageContainer: HTMLElement;

    teamContainer: HTMLElement;
    // workId: string;

    asciiCanvasSize: Vector2;
    goTo: (path: string) => void;

    constructor(work: Work, goTo: (path: string) => void) {
        super("work", []);
        this.work = work;
        this.goTo = goTo;

        const bgResolution = useAsciiStore.getState().backgroundResolution;

        const charSize = useAsciiStore.getState().charSize;

        this.asciiCanvasSize = useAsciiStore.getState().uiResolution;

        this.pageContainer = document.createElement("section");
        this.pageContainer.id = "work";
        this.teamContainer = document.createElement("div");
        this.pageContainer.append(this.teamContainer);

        const main = document.querySelector("main");
        main?.appendChild(this.pageContainer);
    }

    init(isMobile: boolean): void {
        if (!this.work) return;

        const mainLayer = new Layer("work", []);

        // Back button
        mainLayer.addElement(
            new ASCIIButton(
                "<< Go back to works",
                () => this.goTo("/work"),
                new Vector2(6, -4),
                new Color("white"),
                new Color4(0, 0.4, 0.4, 0),
                "left",
                "bottom",
                this.pageContainer
            )
        );

        let position = new Vector2(6, 4);

        // Title
        const asciiTitle = createASCIITitle(this.work.title);
        const title = mainLayer.addElement(
            new ASCIIBlock(
                asciiTitle,
                position.clone(),
                new Color(1,1,1),
                new Color4(1, 1, 1, 0.1),
                "left",
                "top"
            )
        );
        position.y += title.size.y + 1;

        // Subtitle
        mainLayer.addElement(
            new ASCIIBlock(
                this.work.subtitle.toLocaleUpperCase(),
                position.clone(),
                new Color("white"),
                new Color4(0, 0.4, 0.4, 0),
                "left",
                "top"
            )
        );
        position.y += 2;

        // Tags
        this.placeTags(this.work.tags, position);
        position.y += 4;

        // Description
        const description = mainLayer.addElement(
            new ASCIIText(
                this.work.description,
                position.clone(),
                new Color("white"),
                new Color4(0, 0.4, 0.4, 0),
                50,
                "left",
                "top"
            )
        );
        position.y += description.size.y + 3;

        // Tools
        this.placeTools(this.work.tools, position.clone());
        position.y += 4;

        // Team
        const teamMemberCardSize = new Vector2(10, 8);
        this.placeTeam(
            this.work.team,
            position.clone(),
            teamMemberCardSize,
            isMobile
        );
        position.y += teamMemberCardSize.y + 4;

        // Media Viewer
        this.placeMediaViewer(new Vector2(60,14), new Vector2(70,30), isMobile);

        // const barXPosition = Math.floor(this.asciiCanvasSize.x / 5);

        this.layers.push(mainLayer);
    }

    placeTags(tags: string[], position: Vector2) {
        const tagsLayer = new Layer("collaborators", []);
        const tagsContainer = document.createElement("div");

        let offsetX = 0;

        tags.forEach((tag) => {
            const tagElement = tagsLayer.addElement(
                new ASCIIBlock(
                    " " + tag + " ",
                    new Vector2(position.x + offsetX, position.y),
                    new Color("white"),
                    new Color4(0, 0.4, 0.4, 0.2),
                    "left",
                    "top"
                )
            );
            offsetX += tagElement.size.x + 2;
        });

        this.layers.push(tagsLayer);
        this.pageContainer.append(tagsContainer);
    }

    placeMediaViewer(position: Vector2, size: Vector2, isMobile: boolean) {
        if (!this.work?.assets) return;

        const charSize = useAsciiStore.getState().charSize;

        const mediaViewerLayer = new MediaViewerLayer(
            position,
            size,
            this.goTo,
            this.pageContainer,
            isMobile,
            this.work.assets
        );

        const { open, setMediaViewerPosition, setMediaViewerSize } =
            useMediaViewerStore.getState();

        // Set media viewer size and position
        setMediaViewerPosition(
            new Vector2(position.x * charSize.x, position.y * charSize.y)
        );
        setMediaViewerSize(
            new Vector2(size.x * charSize.x, size.y * charSize.y)
        );

        // Open media viewer
        open(this.work.assets);

        this.layers.push(mediaViewerLayer);
    }

    placeTeam(
        team: TeamMember[],
        position: Vector2,
        cardSize: Vector2,
        isMobile: boolean
    ) {
        const teamLayer = new Layer("team", []);
        const teamContainer = document.createElement("div");

        let offsetX = 1;
        const margin = 2;

        let frameWidth = offsetX;

        // Add my card with my roles
        const myCard = new TeamMemberCard(
            {
                id: "me",
                roles: this.work?.roles || [],
            },
            new Vector2(position.x + offsetX, position.y + 2),
            cardSize,
            new Color(0.7, 0.6, 0.2),
            this.goTo,
            this.teamContainer,
            isMobile
        );

        this.layers.push(myCard);

        offsetX += cardSize.x + margin;
        frameWidth += cardSize.x + margin;

        team.forEach((teamMember, index) => {
            const teamMemberCard = new TeamMemberCard(
                teamMember,
                new Vector2(position.x + offsetX, position.y + 2),
                cardSize,
                new Color(1, 1, 1),
                this.goTo,
                this.teamContainer,
                isMobile
            );

            this.layers.push(teamMemberCard);

            if (index < team.length - 1) frameWidth += cardSize.x + margin;
            else frameWidth += teamMemberCard.size.x + 1;

            offsetX += cardSize.x + 2;
        });

        teamLayer.addElement(
            new ASCIITitleFrame(
                "=",
                "TEAM",
                position,
                new Vector2(frameWidth, cardSize.y + 3),
                new Color(1, 1, 1),
                new Color4(0, 0, 0, 0)
            )
        );

        this.layers.push(teamLayer);
        this.pageContainer.append(teamContainer);
    }

    placeTools(tools: string[], position: Vector2): void {
        const toolsLayer = new Layer("tools", []);

        let string = `BUILT WITH: ${tools[0]}`;

        for (let i = 1; i < tools.length; i++) {
            if (i < tools.length - 1) {
                string += ", " + tools[i];
            } else string += " and " + tools[i];
        }

        toolsLayer.addElement(
            new ASCIIBlock(
                string,
                new Vector2(position.x, position.y),
                new Color("white"),
                new Color4(0, 0.4, 0.4, 0),
                "left",
                "top"
            )
        );

        this.layers.push(toolsLayer);
    }

    setWork(_work: Work) {}

    destroy(): void {
        this.pageContainer.remove();
    }
}
