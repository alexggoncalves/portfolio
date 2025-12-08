import { Vector2 } from "three";
import Color4 from "three/src/renderers/common/Color4.js";

import { Element } from "../../PageRenderer/Elements/Element";
import { CanvasImage } from "../../PageRenderer/Elements/CanvasImage";
import useAsciiStore from "../../../stores/asciiStore";

import type { Tag, Work } from "../../../stores/contentStore";
import useContentStore from "../../../stores/contentStore";
import TagLabel from "./TagLabel";

export class WorkCard extends Element {
    work: Work;

    tagLabels: TagLabel[] = [];

    padding = 10;
    scrollOffset = 0;
    yOffset = 0;

    isMouseOver: boolean = false;

    canvasImage: CanvasImage | undefined;
    domLink: HTMLElement;
    onClick: () => void;

    constructor(
        work: Work,
        position: Vector2,
        size: Vector2,
        goTo: (path: string) => void,
        parent?: HTMLElement
    ) {
        super(position);
        this.work = work;
        this.setSize(size.x, size.y);
        this.animated = true;

        // Get work's tags and initialize label elements
        const { getTags } = useContentStore.getState();
        const tagObjects = getTags(this.work.tags);
        this.initializeTagLabels(tagObjects);

        // Get thumbnail asset source
        const thumbnailSrc = work.assets.find(
            (asset) => asset.type === "thumbnail"
        )?.src;

        // Create thumbnail image
        const thumbnail = new Image();
        if (thumbnailSrc) {
            thumbnail.crossOrigin = "anonymous";
            thumbnail.src = thumbnailSrc;
        }

        // Place cover image
        this.canvasImage = new CanvasImage(
            thumbnail,
            this.position,
            size.x,
            size.y
        );

        this.domLink = this.createHTMLLink(
            "Go to " + this.work.title,
            this.position,
            this.size,
            parent
        );

        // Set mouse event listeners
        this.onClick = () => goTo(`/work/${this.work.id}`);
        this.domLink.addEventListener("click", () => this.onClick());
        this.domLink.addEventListener("mouseenter", () => this.onMouseEnter());
        this.domLink.addEventListener("mouseleave", () => this.onMouseLeave());
    }

    initializeTagLabels(tags: Tag[]) {
        const { charSize } = useAsciiStore.getState();

        const gap = 0 * charSize.y;
        const margin = 1.4 * charSize.y

        let yPos = this.position.y * charSize.y
        tags.forEach((tag: Tag) => {
            const x = (this.position.x + this.size.x) * charSize.x;
            const tagLabel = new TagLabel(
                tag,
                new Vector2(x - margin,yPos + margin),
                15 * devicePixelRatio,
                new Vector2(10 * devicePixelRatio, 2 * devicePixelRatio)
            );
            this.tagLabels.push(tagLabel);

            // Increment y offset
            yPos += tagLabel.getTagHeight() + gap;
        });
    }

    update(delta: number, _mousePos?: Vector2, _mouseDown?: boolean): void {
        const { charSize, canvasOffset } = useAsciiStore.getState();

        this.yOffset = (this.position.y - this.scrollOffset) * charSize.y;

        // Update dom button position
        this.domLink.style.top = `${this.yOffset - canvasOffset.y}px`;

        // Update image
        if (this.canvasImage) {
            this.canvasImage.yOffset = this.scrollOffset * charSize.y;
            this.canvasImage.opacity = this.opacity;
            this.canvasImage.update(delta);
        }

        // Update tag labels
        this.tagLabels.forEach((tagLabel: TagLabel) => {
            tagLabel.opacity = this.opacity;
            tagLabel.yOffset = this.scrollOffset * charSize.y
            tagLabel.update();
        });
    }

    draw(
        ui: CanvasRenderingContext2D,
        background: CanvasRenderingContext2D
    ): void {
        const { charSize } = useAsciiStore.getState();

        // Draw hover
        if (this.isMouseOver) {
            this.drawBackgroundRect(
                this.position.x * charSize.x - this.padding / 2,
                this.yOffset - this.padding / 2,
                this.size.x * charSize.x + this.padding,
                this.size.y * charSize.y + this.padding,
                16,
                true,
                new Color4(1, 1, 1, 0.8),
                background
            );
        }

        // Draw image
        this.canvasImage?.draw(ui, background);

        // this.drawTags(background);
        this.tagLabels.forEach((tagLabel: TagLabel) => {
            tagLabel.draw(background);
        });
    }

    onMouseEnter(): void {
        this.isMouseOver = true;
        this.openTagLabels()
    }

    onMouseLeave(): void {
        this.isMouseOver = false;
        this.closeTagLabels();
    }

    openTagLabels(){
        this.tagLabels.forEach((taglabel:TagLabel)=>{
            taglabel.open();
        })
    }

    closeTagLabels(){
        this.tagLabels.forEach((taglabel:TagLabel)=>{
            taglabel.close();
        })
    }

    destroy(): void {
        this.canvasImage?.destroy();

        // Destroy eventListeners
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
