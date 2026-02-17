import { Vector2, Color } from "three";
import Color4 from "three/src/renderers/common/Color4.js";
import { Layer } from "../pages/layout/Layer";
import { ASCIIButton } from "./ASCIIButton";
import type { InteractiveElement } from "./InteractiveElement";

//-------------------------------
//          FRAME LAYER
//-------------------------------

export class Navigation extends Layer {
    goTo: (path: string) => void;

    hoveredElement: InteractiveElement | null = null;

    constructor(goTo: (path: string) => void) {
        super("navigation", []);
        this.goTo = goTo;
    }

    init(isMobile?: boolean): void {
        this.addElement(
            new ASCIIButton(
                "home",
                () => this.goTo("/"),
                isMobile ? new Vector2(-4, -8) : new Vector2(-4, 3),
                new Color("white"),
                new Color4(0, 0.4, 0.4, 0),
                "right",
                isMobile ? "bottom" : "top",
                undefined,
                false,
            ),
        );

        this.addElement(
            new ASCIIButton(
                "work",
                () => this.goTo("/work"),
                isMobile ? new Vector2(-4, -6) : new Vector2(-4, 5),
                new Color("white"),
                new Color4(0, 0.4, 0.4, 0),
                "right",
                isMobile ? "bottom" : "top",
                undefined,
                false,
            ),
        );

        this.addElement(
            new ASCIIButton(
                "contacts",
                () => this.goTo("/contacts"),
                isMobile ? new Vector2(-4, -4) : new Vector2(-4, 7),
                new Color("white"),
                new Color4(0, 0.4, 0.4, 0),
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
