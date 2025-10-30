import { ASCIIPage } from "../ASCIIField/ASCIIPage";
import { ASCIILayer } from "../ASCIIField/ASCIILayer";
import { Vector2, Color } from "three";
import { ASCIIBlock, ASCIIImage } from "../ASCIIField/ASCIIElement";
import Color4 from "three/src/renderers/common/Color4.js";

const title = `WORK`;

import type { Work } from "../../stores/workStore";

import useWorkStore from "../../stores/workStore";

export class WorkPage extends ASCIIPage {
    works: Work[];
    images: ASCIIImage[] = [];

    constructor(work: Work[]) {
        super("work", []);
        this.works = work;
    }

    init(): void {
        const mainLayer = new ASCIILayer("work", []);

        mainLayer.addElement(
            new ASCIIBlock(
                title,
                new Vector2(5, 4),
                new Color("white"),
                new Color4(0, 0.4, 0.4, 0),
                "left",
                "top"
            )
        );

        if (this.works[0]) {
            const asciiImage = new ASCIIImage(
                this.works[0].images[0],
                new Vector2(20, 20),
                16 * 2,
                16 / 9
            );
            this.images.push(asciiImage);
            mainLayer.addElement(asciiImage);
        }

        this.layers.push(mainLayer);
    }

    fadeImagesToAscii(): void {
        this.images.forEach((image : ASCIIImage)=> {
            image.fadeToAscii();
        });
    }
    fadeToFullImages(): void {
        this.images.forEach((image : ASCIIImage)=> {
            image.fadeToFullImage();
        });
    }
}
