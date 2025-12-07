import { Vector2 } from "three";
import Color4 from "three/src/renderers/common/Color4.js";

import { Element } from "../../PageRenderer/Elements/Element";
import { CanvasImage } from "../../PageRenderer/Elements/CanvasImage";
import useAsciiStore from "../../../stores/asciiStore";

export class WorkCard extends Element {
    title: string;
    image: CanvasImageSource;
    workId: string;

    canvasImage: CanvasImage;

    domLink: HTMLElement;
    onClick: () => void;

    isMouseOver: boolean = false;

    padding = 10;
    scrollOffset = 0;

    constructor(
        image: HTMLImageElement,
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
        this.canvasImage = new CanvasImage(
            image,
            this.position,
            size.x,
            size.y
        );
        this.setSize(size.x, size.y);

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

    onMouseEnter(): void {
        this.isMouseOver = true;
        console.log("hovering on", this.title);
    }

    onMouseLeave(): void {
        this.isMouseOver = false;
    }

    draw(
        ui: CanvasRenderingContext2D,
        background: CanvasRenderingContext2D
    ): void {
        const { charSize, canvasOffset } = useAsciiStore.getState();

        const yOffset = this.position.y - this.scrollOffset;

        if (this.isMouseOver) {
            this.drawBackgroundRect(
                this.position.x * charSize.x - this.padding / 2,
                yOffset * charSize.y - this.padding / 2,
                this.size.x * charSize.x + this.padding,
                this.size.y * charSize.y + this.padding,
                14,
                true,
                new Color4(1, 1, 1, 0.8),
                background
            );
        }

        this.domLink.style.top = `${yOffset * charSize.y - canvasOffset.y}px`;

        this.canvasImage.setYOffset(this.scrollOffset * charSize.y);

        this.canvasImage.setOpacity(this.opacity);

        this.canvasImage?.draw(ui, background);
    }

    update(delta: number, _mousePos?: Vector2, _mouseDown?: boolean): void {
        this.canvasImage?.update(delta);
    }

    destroy(): void {
        this.canvasImage.destroy();

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
