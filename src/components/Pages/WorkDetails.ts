import { ASCIIPage } from "../ASCIIField/ASCIIPage";
import { ASCIILayer } from "../ASCIIField/ASCIILayer";
import { Vector2, Color } from "three";
import Color4 from "three/src/renderers/common/Color4.js";
import type { TeamMember, Work } from "../../stores/workStore";
import useAsciiStore from "../../stores/asciiStore";

import { ASCIIBlock } from "../ASCIIField/ASCIIElement/ASCIIElement";
import { ASCIIText } from "../ASCIIField/ASCIIElement/ASCIIText";
import { ASCIIButton } from "../ASCIIField/ASCIIElement/ASCIIButton";
import { createASCIITitle } from "../ASCIIField/asciiFonts";
import { TeamMemberCard } from "./Elements/TeamMemberCard";
import { ASCIITitleFrame } from "../ASCIIField/ASCIIElement/ASCIIFrame";

export class WorkDetails extends ASCIIPage {
    work: Work | null = null;
    pageContainer: HTMLElement;
    // workId: string;

    myTeamMemberObj: TeamMember = {
        name: "Alexandre Gonçalves",
        link: "",
        roles: [],
    };

    asciiCanvasSize: Vector2;
    goTo: (path: string) => void;

    constructor(work: Work, goTo: (path: string) => void) {
        super("work", []);
        this.work = work;
        this.goTo = goTo;

        const canvasSize = useAsciiStore.getState().canvasSize;
        const charSize = useAsciiStore.getState().charSize;

        this.asciiCanvasSize = new Vector2(
            canvasSize.x / charSize.x,
            canvasSize.y / charSize.y
        );

        this.pageContainer = document.createElement("section");
        this.pageContainer.id = "work";
        const main = document.querySelector("main");
        main?.appendChild(this.pageContainer);
    }

    init(_isMobile: boolean): void {
        if (!this.work) return;
        this.myTeamMemberObj.roles = this.work.roles;

        const mainLayer = new ASCIILayer("work", []);

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
                new Color("white"),
                new Color4(0, 0.4, 0.4, 0),
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
        const teamMemberCardSize = new Vector2(10, 9);
        this.placeTeam(this.work.team, position.clone(), teamMemberCardSize);
        position.y += teamMemberCardSize.y + 4;

        

        // Image Carrousel
        // ...

        // const barXPosition = Math.floor(this.asciiCanvasSize.x / 5);

        this.layers.push(mainLayer);
    }

    placeTags(tags: string[], position: Vector2) {
        const tagsLayer = new ASCIILayer("collaborators", []);
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

    placeTeam(team: TeamMember[], position: Vector2, cardSize: Vector2) {
        const teamLayer = new ASCIILayer("team", []);
        const teamContainer = document.createElement("div");

        let offsetX = 1;
        const margin = 2;

        let frameWidth = offsetX;

        teamLayer.addElement(
            new TeamMemberCard(
                this.myTeamMemberObj,
                new Vector2(position.x + offsetX, position.y + 1),
                this.goTo,
                this.pageContainer,
                new Color(0.7, 0.6, 0.2),
                new Color4(0, 0.4, 0.4, 0)
            )
        );

        offsetX += cardSize.x + margin;
        frameWidth += cardSize.x + margin;

        team.forEach((teamMember, index) => {
            const teamMemberCard = teamLayer.addElement(
                new TeamMemberCard(
                    teamMember,
                    new Vector2(position.x + offsetX, position.y + 1),
                    this.goTo,
                    this.pageContainer,
                    new Color(0.7, 0.7, 0.7),
                    new Color4(0, 0.4, 0.4, 0)
                )
            );

            if (index < team.length - 1) frameWidth += cardSize.x + margin;
            else frameWidth += teamMemberCard.size.x + 1;

            offsetX += cardSize.x + 2;
        });

        teamLayer.addElement(
            new ASCIITitleFrame(
                "=",
                "TEAM",
                position,
                new Vector2(frameWidth, cardSize.y),
                new Color(1, 1, 1),
                new Color4(0, 0, 0, 0)
            )
        );

        this.layers.push(teamLayer);
        this.pageContainer.append(teamContainer);
    }

    placeTools(tools: string[], position: Vector2): void {
        const toolsLayer = new ASCIILayer("tools", []);

        let string = `BUILT WITH: ${tools[0]}` ;

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
