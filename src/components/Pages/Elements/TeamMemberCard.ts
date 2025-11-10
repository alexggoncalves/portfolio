import { Vector2, Color } from "three";
import Color4 from "three/src/renderers/common/Color4.js";

import { ASCIIElement } from "../../ASCIIField/ASCIIElement/ASCIIElement";

import useAsciiStore from "../../../stores/asciiStore";
import type { TeamMember } from "../../../stores/workStore";

const charSize = useAsciiStore.getState().charSize;

export class TeamMemberCard extends ASCIIElement {
    name: string;
    teamMember: TeamMember;

    // image: CanvasImageSource;

    domLink: HTMLElement;
    onClick: () => void;

    isMouseOver: boolean = false;
    isMouseDown: boolean = false;

    constructor(
        teamMember: TeamMember,
        position: Vector2,
        _goTo: (path: string) => void,
        parent: HTMLElement,
        color: Color,
        backgroundColor?: Color4,
        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom"
    ) {
        super(position, color, backgroundColor, horizontalAlign, verticalAlign);
        this.animated = true;

        this.teamMember = teamMember;
        this.name = this.parseName(this.teamMember.name);

        this.setSize(this.name);

        this.domLink = this.createHTMLLink(
            `Go to ${this.teamMember.name}`,
            new Vector2(this.position.x, this.position.y + 1),
            new Vector2(this.size.x, 6),
            parent
        );

        // Set mouse event listeners
        this.onClick = () => {
                window.open(this.teamMember.link, "_blank");
        }
        
        this.domLink.addEventListener("click", () => this.onClick());
        this.domLink.addEventListener("mouseenter", () => this.onMouseEnter());
        this.domLink.addEventListener("mouseleave", () => this.onMouseLeave());
    }

    onMouseEnter(): void {}

    onMouseLeave(): void {}

    update(_delta?: number, _mousePos?: Vector2, _mouseDown?: boolean): void {}

    draw(
        ui: CanvasRenderingContext2D,
        background: CanvasRenderingContext2D
    ): void {
        if (!this.teamMember) return;

        // this.drawBlock(">>>", ui, background)
        this.drawBlock(this.name, ui, background, new Vector2(0, 5));
        this.drawBackgroundRect(
            this.position.x * charSize.x,
            (this.position.y + 1) * charSize.y,
            4 * charSize.x,
            3 * charSize.y,
            new Color4(1, 1, 1, 0.1),
            background
        );

        if (this.isMouseOver) {
            // this.drawButtonFrame(1, new Color4(...this.color, 1), background);
        }
    }

    parseName(name: string): string {
        const parts = name.split(" ");
        return parts.join("\n");
    }

    destroy(): void {
        this.domLink.removeEventListener("click", () => this.onClick?.());
        this.domLink.removeEventListener("mouseenter", () =>
            this.onMouseEnter?.()
        );
        this.domLink.removeEventListener("mouseleave", () =>
            this.onMouseLeave?.()
        );
        this.domLink.remove();
    }
}
