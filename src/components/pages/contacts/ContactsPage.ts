import { Page } from "../../elements/core/Page";
import { Layer } from "../../elements/core/Layer";
import { Color } from "three";
import { AsciiBlock } from "../../elements/ascii/AsciiBlock";
import Color4 from "three/src/renderers/common/Color4.js";
import { AppState } from "../../app/AppState";

const title = `CONTACTS`;

const titleMobile = `CONTACTS-mobile`;

export class ContactsPage extends Page {
    constructor( goTo: (path: string) => void) {
        super("contacts", goTo);

        this.init();
    }

    init(): void {
        const mainLayer = new Layer("contacts", []);

        mainLayer.addElement(
            new AsciiBlock(
                AppState.device == "mobile" ? titleMobile : title,
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
