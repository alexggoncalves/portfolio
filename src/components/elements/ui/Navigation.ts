import { Vector2, Color } from "three";
import Color4 from "three/src/renderers/common/Color4.js";
import { Layer } from "../core/Layer";
import { AsciiButton } from "../ascii/AsciiButton";
import type { InteractiveElement } from "../core/InteractiveElement";

//-------------------------------
//          FRAME LAYER
//-------------------------------

export class Navigation extends Layer {
    color: Color = new Color("white");
    backgroundColor: Color4 = new Color4(0, 0.4, 0.4, 0);

    goTo: (path: string) => void;

    hoveredElement: InteractiveElement | null = null;

    constructor(goTo: (path: string) => void) {
        super("navigation", []);
        this.goTo = goTo;
    }

    init(isMobile?: boolean): void {
        let x = -5;
        let y = 3;

        const contactsButton = new AsciiButton(
            "contacts",
            () => this.goTo("/contacts"),
            x,
            y,
            this.color,
            this.backgroundColor,
            "right",
            isMobile ? "bottom" : "top",
            undefined,
            false,
        );
        this.addElement(contactsButton);

        x -= contactsButton.gridW + 3;

        const projectsButton = new AsciiButton(
            "projects",
            () => this.goTo("/projects"),
            x,
            y,
            this.color,
            this.backgroundColor,
            "right",
            isMobile ? "bottom" : "top",
            undefined,
            false,
        );
        this.addElement(projectsButton);

        x -= projectsButton.gridW + 3;
        const homeButton = new AsciiButton(
            "home",
            () => this.goTo("/"),
            x,
            y,
            this.color,
            this.backgroundColor,
            "right",
            isMobile ? "bottom" : "top",
            undefined,
            false,
        );
        this.addElement(homeButton);
    }

    resetHoverStates() {
        this.interactiveElements.forEach((element) => {
            element.isMouseOver = false;
        });
    }

    updateMouseState(mouseX: number, mouseY: number): void {
        this.hoveredElement = null;
        this.interactiveElements.forEach((element: InteractiveElement) => {
            if (element.contains(mouseX, mouseY)) {
                this.hoveredElement = element;
                return;
            }
        });
    }
}
