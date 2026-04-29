import { Page } from "../../elements/core/Page";
import { Layer } from "../../elements/core/Layer";
import { AsciiBlock } from "../../elements/ascii/AsciiBlock";

export class ContactsPage extends Page {
    constructor( goTo: (path: string) => void) {
        super("contacts", goTo);

        this.init();
    }

    init(): void {
        const mainLayer = new Layer("contacts", []);

        mainLayer.addElement(
            new AsciiBlock(
                "a",
                5,
                4,
                "white",
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
