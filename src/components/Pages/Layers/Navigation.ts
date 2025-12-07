import { Vector2, Color } from "three";
import Color4 from "three/src/renderers/common/Color4.js";

import { ASCIIButton } from "../../PageRenderer/Elements/ASCIIButton";
import { Layer } from "../../PageRenderer/Layer";

//-------------------------------
//          FRAME LAYER
//-------------------------------

export class Navigation extends Layer {
    goTo: (path: string) => void;
    nav: HTMLElement;

    constructor(goTo: (path: string) => void) {
        super("frame", []);
        this.goTo = goTo;

        this.nav = document.createElement("nav");
        const header = document.querySelector("header");
        header?.appendChild(this.nav);
    }

    init(isMobile?: boolean): void {
        this.addElement(
            new ASCIIButton(
                "home",
                () => this.goTo("/"),
                isMobile ? new Vector2(-4, -8) : new Vector2(-4, 4),
                new Color("white"),
                new Color4(0, 0.4, 0.4, 0),
                "right",
                isMobile ? "bottom" : "top",
                this.nav
            )
        );

        this.addElement(
            new ASCIIButton(
                "work",
                () => this.goTo("/work"),
                isMobile ? new Vector2(-4, -6) : new Vector2(-4, 6),
                new Color("white"),
                new Color4(0, 0.4, 0.4, 0),
                "right",
                isMobile ? "bottom" : "top",
                this.nav
            )
        );

        this.addElement(
            new ASCIIButton(
                "contacts",
                () => this.goTo("/contacts"),
                isMobile ? new Vector2(-4, -4) : new Vector2(-4, 8),
                new Color("white"),
                new Color4(0, 0.4, 0.4, 0),
                "right",
                isMobile ? "bottom" : "top",
                this.nav
            )
        );
    }

    destroy(): void {
        this.nav.remove();
    }
}
