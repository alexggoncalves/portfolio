import { ASCIIPage } from "../ASCIIField/ASCIIPage";
import { ASCIILayer } from "../ASCIIField/ASCIILayer";
import { Vector2, Color } from "three";
import { ASCIIBlock } from "../ASCIIField/ASCIIElement";
import Color4 from "three/src/renderers/common/Color4.js";

const title = `CONTACTS`;

const titleMobile = `CONTACTS-mobile`;

export class ContactsPage extends ASCIIPage {
    constructor(layers?: ASCIILayer[]) {
        super("contacts", layers);
    }

    init(isMobile: boolean): void {
        const mainLayer = new ASCIILayer("contacts", []);

        mainLayer.addElement(
            new ASCIIBlock(
                isMobile ? titleMobile : title,
                new Vector2(5, 4),
                new Color("white"),
                new Color4(0, 0.4, 0.4, 0),
                "left",
                "top"
            )
        );

        this.layers.push(mainLayer);
    }
}
