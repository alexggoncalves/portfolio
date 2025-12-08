import { Vector2, Color } from "three";
import Color4 from "three/src/renderers/common/Color4.js";

import { ASCIIButton } from "../../PageRenderer/Elements/ASCIIButton";
import { Layer } from "../../PageRenderer/Layer";

import type { TeamMember } from "../../../stores/contentStore";
import useContentStore from "../../../stores/contentStore";
import { ASCIIBlock } from "../../PageRenderer/Elements/Element";
// import { CanvasImage } from "../../PageRenderer/Elements/CanvasImage";

//-------------------------------
//          FRAME LAYER
//-------------------------------

export class TeamMemberCard extends Layer {
    imageSize: Vector2 = new Vector2(4, 3);
    size: Vector2;
    nameColor: Color;
    link?: string;

    position: Vector2;

    name: string;
    teamMember: TeamMember;
    avatar?: CanvasImageSource;

    goTo: (path: string) => void;
    cardContainer?: HTMLElement;

    constructor(
        teamMember: TeamMember,
        position: Vector2,
        size: Vector2,
        nameColor: Color,
        goTo: (path: string) => void,
        parent: HTMLElement,
        isMobile: boolean
    ) {
        super("frame", []);
        this.goTo = goTo;

        this.teamMember = teamMember;
        this.position = position;
        this.size = size;
        this.nameColor = nameColor;

        const person = useContentStore.getState().getPersonById(teamMember.id);
        

        if (person) {
            this.name = this.parseName(person.name);
            this.cardContainer = document.createElement("div");
            parent.append(this.cardContainer);

            this.link = person.link;
        } else {
            this.name = "";
        }

        this.init(isMobile);
    }

    init(_isMobile?: boolean): void {
        if (this.avatar)
            // this.addElement(
            //     new CanvasImage(
            //         this.avatar,
            //         new Vector2(this.position.x, this.position.y),
            //         8,
            //         8 / 5.5
            //     )
            // );

        this.addElement(
            new ASCIIBlock(
                this.name,
                new Vector2(this.position.x, this.position.y + this.size.y - 2),
                this.nameColor,
                new Color4(0, 0, 0, 0)
            )
        );

        if (this.link) {
            console.log(this.link);
            this.addElement(
                new ASCIIButton(
                    "",
                    () => {
                        if (this.link) window.open(this.link);
                    },
                    this.position,
                    new Color(1, 1, 1),
                    new Color4(0, 0, 0, 0),
                    "left",
                    "top",
                    this.cardContainer,
                    this.size
                )
            );
        }
    }

    parseName(name: string): string {
        const parts = name.split(" ");

        if (parts.length < 2) return name;

        // const surnameOffset:number = this.size.x - parts[1].length;
        // parts[1] = ' '.repeat(surnameOffset) + parts[1];

        return parts.join("\n");
    }

    destroy(): void {
        this.cardContainer?.remove();
    }
}
