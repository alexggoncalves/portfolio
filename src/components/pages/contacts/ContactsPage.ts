import { Page } from "../../elements/core/Page";
import { Layer } from "../../elements/core/Layer";
import { Vector2, Color } from "three";
import { AsciiBlock } from "../../elements/ascii/AsciiBlock";
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
            new AsciiBlock(
                this.isMobile ? titleMobile : title,
                5,
                4,
                new Color("white"),
                new Color4(0, 0.4, 0.4, 0),
                "left",
                "top",
            ),
        );

        this.layers.push(mainLayer);
    }

    destroy(): void {
        super.destroy();
    }
}
