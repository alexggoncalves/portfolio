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
        this.addElement(
            new AsciiButton(
                "home",
                () => this.goTo("/"),
                isMobile ? new Vector2(-4, -8) : new Vector2(-4, 3),
                this.color,
                this.backgroundColor,
                "right",
                isMobile ? "bottom" : "top",
                undefined,
                false,
            ),
        );

        this.addElement(
            new AsciiButton(
                "work",
                () => this.goTo("/work"),
                isMobile ? new Vector2(-4, -6) : new Vector2(-4, 5),
                this.color,
                this.backgroundColor,
                "right",
                isMobile ? "bottom" : "top",
                undefined,
                false,
            ),
        );

        this.addElement(
            new AsciiButton(
                "contacts",
                () => this.goTo("/contacts"),
                isMobile ? new Vector2(-4, -4) : new Vector2(-4, 7),
                this.color,
                this.backgroundColor,
                "right",
                isMobile ? "bottom" : "top",
                undefined,
                false,
            ),
        );
    }

    resetHoverStates() {
        this.interactiveElements.forEach((element) => {
            element.isMouseOver = false;
        });
    }

    updateMouseState(mousePos: Vector2) {
        this.hoveredElement = null;
        this.interactiveElements.forEach((element: InteractiveElement) => {
            if (element.contains(mousePos)) {
                this.hoveredElement = element;
                return;
            }
        });
    }
}
