import { Vector2, Color } from "three";
import Color4 from "three/src/renderers/common/Color4.js";

import { ASCIIButton } from "../../ASCIIField/ASCIIElement/ASCIIButton";
import { ASCIILayer } from "../../ASCIIField/ASCIILayer";

import type { Asset } from "../../../stores/contentStore";
import { ASCIIBlock } from "../../ASCIIField/ASCIIElement/ASCIIElement";
// import useContentStore from "../../../stores/contentStore";
// import { ASCIIBlock } from "../../ASCIIField/ASCIIElement/ASCIIElement";
// import { ASCIIImage } from "../../ASCIIField/ASCIIElement/ASCIIImage";

//-------------------------------
//          FRAME LAYER
//-------------------------------

export class MediaViewerLayer extends ASCIILayer {
    imageSize: Vector2 = new Vector2(4, 3);
    size: Vector2;

    position: Vector2;

    assets?: Asset[];
    currentIndex: number = 0;

    goTo: (path: string) => void;
    mediaViewerContainer?: HTMLElement;

    indexIndicator?: ASCIIBlock;

    constructor(
        position: Vector2,
        size: Vector2,
        goTo: (path: string) => void,
        parent: HTMLElement,
        isMobile: boolean,
        assets?: Asset[]
    ) {
        super("frame", []);
        this.goTo = goTo;

        this.assets = assets;
        this.position = position;
        this.size = size;

        this.mediaViewerContainer = document.createElement("div");
        this.mediaViewerContainer.id = "media-viewer";
        parent.append(this.mediaViewerContainer);

        this.init(isMobile);
    }

    init(_isMobile?: boolean): void {
        // Left
        this.addElement(
            new ASCIIButton(
                "   \n < \n   ",
                () => {console.log("left")},
                new Vector2(this.position.x, this.position.y + this.size.y),
                new Color(1, 1, 1),
                new Color4(0.4, 0.4, 0.4, 0.1),
                "left",
                "top",
                this.mediaViewerContainer,
                new Vector2(3, 3)
            )
        );

        // Right
        this.addElement(
            new ASCIIButton(
                "   \n > \n   ",
                () => {console.log("right")},
                new Vector2(
                    this.position.x + 3,
                    this.position.y + this.size.y
                ),
                new Color(1, 1, 1),
                new Color4(0.4, 0.4, 0.4, 0.1),
                "left",
                "top",
                this.mediaViewerContainer,
                new Vector2(3, 3)
            )
        );

        // Index indicator
        this.indexIndicator = this.addElement(
            new ASCIIBlock(
                "01/16",
                new Vector2(
                    this.position.x + 7,
                    this.position.y + this.size.y + 1
                ),
                new Color(1, 1, 1),
                new Color4(0, 0, 0, 0),
                "left",
                "top"
            )
        ) as ASCIIBlock;
    }

    setIndicatorString(indicator: string) {
        if (!this.indexIndicator) return
        this.indexIndicator.text = indicator;
    }

    destroy(): void {
        this.mediaViewerContainer?.remove();
    }
}
