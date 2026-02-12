import { Page } from "./layout/Page";
import { Layer } from "./layout/Layer";
import { Vector2, Color } from "three";
import { ASCIIBlock } from "../elements/ASCIIBlock";
import Color4 from "three/src/renderers/common/Color4.js";

const title = `CONTACTS`;

const titleMobile = `CONTACTS-mobile`;

export class ContactsPage extends Page {
    constructor(isMobile: boolean, goTo: (path: string) => void) {
        super("contacts", isMobile, goTo);

        this.init();
    }

    init(): void {
        const mainLayer = new Layer("contacts", []);

        mainLayer.addElement(
            new ASCIIBlock(
                this.isMobile ? titleMobile : title,
                new Vector2(5, 4),
                new Color("white"),
                new Color4(0, 0.4, 0.4, 0),
                "left",
                "top",
            ),
        );

        this.layers.push(mainLayer);
    }
}
