import { Vector2, Color } from "three";
import Color4 from "three/src/renderers/common/Color4.js";

import {
    ASCIIBlock,
    ASCIIElement,
} from "../../ASCIIField/ASCIIElement/ASCIIElement";
import { ASCIIImage } from "../../ASCIIField/ASCIIElement/ASCIIImage";

export class WorkCard extends ASCIIElement {
    title: string;
    image: CanvasImageSource;
    workId: string;

    asciiImage: ASCIIImage;
    asciiTitle: ASCIIBlock;

    domLink: HTMLElement;
    onClick: () => void;

    constructor(
        image: CanvasImageSource,
        title: string,
        workId: string,
        position: Vector2,
        size: Vector2,
        goTo: (path: string) => void,
        parent?: HTMLElement
    ) {
        super(position);

        this.title = title;
        this.image = image;
        this.workId = workId;

        this.animated = true;

        // Place cover image
        this.asciiImage = new ASCIIImage(image, this.position, size.x, size.y);
        this.setSize(this.asciiImage.size.x, this.asciiImage.size.y);

        // Place title
        const titlePosition = new Vector2(
            position.x,
            position.y + this.asciiImage?.size.height + 1
        );

        this.asciiTitle = new ASCIIBlock(
            this.title,
            titlePosition,
            new Color(1, 1, 1),
            new Color4(1, 1, 1, 0)
        );

        this.domLink = this.createHTMLLink(
            "Go to " + title,
            this.position,
            this.size,
            parent
        );

        // Set mouse event listeners
        this.onClick = () => goTo(`/work/${this.workId}`);
        this.domLink.addEventListener("click", () => this.onClick());
        this.domLink.addEventListener("mouseenter", () => this.onMouseEnter());
        this.domLink.addEventListener("mouseleave", () => this.onMouseLeave());
    }

    onMouseEnter(): void {}

    onMouseLeave(): void {}

    draw(
        ui: CanvasRenderingContext2D,
        background: CanvasRenderingContext2D
    ): void {
        this.asciiImage.setOpacity(this.opacity);
        this.asciiImage?.draw(ui, background);
        this.asciiTitle.setOpacity(this.opacity);
        this.asciiTitle?.draw(ui, background);
    }

    update(delta: number, _mousePos?: Vector2, _mouseDown?: boolean): void {
        this.asciiImage?.update(delta);
        this.asciiTitle?.update();
    }

    getImage(): ASCIIImage {
        return this.asciiImage;
    }

    destroy(): void {
        this.asciiImage.destroy();
        this.asciiTitle.destroy();

        this.domLink.removeEventListener("click", () => this.onClick?.());
        this.domLink.removeEventListener("mouseenter", () =>
            this.onMouseEnter?.()
        );
        this.domLink.removeEventListener("mouseleave", () =>
            this.onMouseLeave?.()
        );
        this.domLink.remove();
    }
}
