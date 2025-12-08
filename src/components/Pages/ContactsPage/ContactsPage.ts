import { Page } from "../../PageRenderer/Page";
import { Layer } from "../../PageRenderer/Layer";
import { Vector2, Color } from "three";
import { ASCIIBlock } from "../../PageRenderer/Elements/Element";
import Color4 from "three/src/renderers/common/Color4.js";

const title = `CONTACTS`;

const titleMobile = `CONTACTS-mobile`;

export class ContactsPage extends Page {
    constructor(layers?: Layer[]) {
        super("contacts", layers);
    }

    init(isMobile: boolean): void {
        const mainLayer = new Layer("contacts", []);

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
