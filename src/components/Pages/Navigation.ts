import { Vector2, Color } from "three";
import Color4 from "three/src/renderers/common/Color4.js";

import { ASCIIButton } from "../ASCIIField/ASCIIElement";
import { ASCIILayer } from "../ASCIIField/ASCIILayer";

//-------------------------------
//          FRAME LAYER
//-------------------------------

export class Navigation extends ASCIILayer {
    goTo: (path: string) => void;

    constructor(goTo: (path: string) => void) {
        super("frame", []);
        this.goTo = goTo;
    }

    init(): void {

        this.addElement(
            new ASCIIButton(
                "home",
                () => this.goTo("/"),
                new Vector2(-4, 4),
                new Color("white"),
                new Color4(0, 0.4, 0.4, 0),
                "right",
                "top"
            )
        );

        this.addElement(
            new ASCIIButton(
                "work",
                () => this.goTo("/work"),
                new Vector2(-4, 6),
                new Color("white"),
                new Color4(0, 0.4, 0.4, 0),
                "right",
                "top"
            )
        );

        this.addElement(
            new ASCIIButton(
                "contacts",
                () => this.goTo("/contacts"),
                new Vector2(-4, 8),
                new Color("white"),
                new Color4(0, 0.4, 0.4, 0),
                "right",
                "top"
            )
        );
    }
}