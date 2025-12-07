import { Vector2, Color } from "three";
import Color4 from "three/src/renderers/common/Color4.js";

import { ASCIIButton } from "../../PageRenderer/Elements/ASCIIButton";
import { Layer } from "../../PageRenderer/Layer";

import type { Asset } from "../../../stores/contentStore";
import { ASCIIBlock } from "../../PageRenderer/Elements/Element";

import useMediaViewerStore from "../../../stores/mediaViewerStore";

import { Element } from "../../PageRenderer/Elements/Element";

//-------------------------------
//          FRAME LAYER
//-------------------------------

export class MediaViewerLayer extends Layer {
    imageSize: Vector2 = new Vector2(4, 3);
    size: Vector2;

    position: Vector2;

    media?: Asset[];
    mediaLength: number = 0;
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
        media?: Asset[]
    ) {
        super("frame", []);
        this.goTo = goTo;

        this.media = media;
        this.position = position;
        this.size = size;

        this.mediaViewerContainer = document.createElement("div");
        this.mediaViewerContainer.id = "media-viewer";
        parent.append(this.mediaViewerContainer);

        this.init(isMobile);
    }

    init(_isMobile?: boolean): void {
        const next = useMediaViewerStore.getState().next;
        const prev = useMediaViewerStore.getState().prev;

        // Left
        this.addElement(
            new ASCIIButton(
                "   \n < \n   ",
                prev,
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
                next,
                new Vector2(this.position.x + 3, this.position.y + this.size.y),
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
                `00/00`,
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

    update(
        uiContext: CanvasRenderingContext2D,
        backgroundContext: CanvasRenderingContext2D,
        delta: number,
        mousePos: Vector2,
        opacity: number
    ): void {
        this.setIndicator();

        this.elements.forEach((element: Element) => {
            if (element.animated) {
                element.update(delta);
            } else if (element.interactive) {
                element.update(delta, mousePos, false);
            }
        });

        this.draw(uiContext, backgroundContext, opacity);
    }

    setIndicator() {
        const currentIndex = useMediaViewerStore.getState().currentIndex;
        const mediaLength = useMediaViewerStore.getState().mediaLength;

        if (
            this.currentIndex != currentIndex ||
            this.mediaLength != mediaLength
        ) {
            let indicatorString = `${currentIndex < 10 ? `0${currentIndex + 1}` : currentIndex + 1}`;
            indicatorString += `/${mediaLength < 10 ? `0${mediaLength}`: mediaLength}`

            if (this.indexIndicator) {
                this.indexIndicator.text = indicatorString;
            }
        }

        this.currentIndex = currentIndex;
    }

    destroy(): void {
        this.mediaViewerContainer?.remove();
    }
}
