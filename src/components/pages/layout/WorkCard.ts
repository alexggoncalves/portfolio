import { Vector2 } from "three";
import Color4 from "three/src/renderers/common/Color4.js";

import { CanvasImage } from "../../elements/CanvasImage";
import useAsciiStore from "../../../stores/asciiStore";

import type { Tag, Work } from "../../../stores/contentStore";
import useContentStore from "../../../stores/contentStore";
import useCursorStore from "../../../stores/cursorStore";

import TagLabel from "./TagLabel";
import type { NavigationSource } from "../../../stores/sceneStore";
import useSceneStore from "../../../stores/sceneStore";
import { InteractiveElement } from "../../elements/InteractiveElement";

export class WorkCard extends InteractiveElement {
    work: Work;
    tagLabels: TagLabel[] = [];
    canvasImage: CanvasImage | undefined;
    padding = 10;

    navigationSource: NavigationSource = "home";
    goTo?: (path: string) => void;

    tagsOpened: boolean = false;

    cornerRadius: number = 40;

    constructor(
        work: Work,
        position: Vector2,
        size: Vector2,
        goTo?: (path: string) => void,
        navigationSource?: NavigationSource,
    ) {
        super(position);
        this.work = work;
        this.setSize(size.x, size.y);
        this.isInteractive = true;

        if (goTo) this.goTo = goTo;

        if (navigationSource) this.navigationSource = navigationSource;

        // Get work's tags and initialize label elements
        const { getTags } = useContentStore.getState();
        const tagObjects = getTags(this.work.tags);
        this.initializeTagLabels(tagObjects);

        // Create thumbnail
        if (work.thumbnailSrc) {
            this.canvasImage = new CanvasImage(
                work.thumbnailSrc,
                this.gridPosition,
                size.x,
                size.y,
                this.cornerRadius,
            );
        }
    }

    initializeTagLabels(tags: Tag[]) {
        const { charSize } = useAsciiStore.getState();

        const gap = 0 * charSize.y;
        const margin = 1.4 * charSize.y;

        let yPos = this.pixelPosition.y;
        tags.forEach((tag: Tag) => {
            const x = this.pixelPosition.x + this.pixelSize.x;
            const tagLabel = new TagLabel(
                tag,
                new Vector2(x - margin, yPos + margin),
                15 * devicePixelRatio,
                new Vector2(10 * devicePixelRatio, 2 * devicePixelRatio),
            );
            this.tagLabels.push(tagLabel);

            // Increment y offset
            yPos += tagLabel.getTagHeight() + gap;
        });
    }

    update(): void {
        if (this.isMouseOver && !this.tagsOpened) {
            this.openTagLabels();
            this.tagsOpened = true;
        } else if (!this.isMouseOver && this.tagsOpened) {
            this.closeTagLabels();
            this.tagsOpened = false;
        }

        // Update image
        if (this.canvasImage) {
            this.canvasImage.setYOffset(this.gridOffset.y);
            this.canvasImage.opacity = this.opacity;
        }

        // Update tag labels
        this.tagLabels.forEach((tagLabel: TagLabel) => {
            tagLabel.opacity = this.opacity;
            tagLabel.yOffset = this.gridOffset.y;
            tagLabel.update();
        });
    }

    draw(
        asciiCtx: CanvasRenderingContext2D,
        bgCtx: CanvasRenderingContext2D,
    ): void {
        // Draw hover highlight
        if (this.isMouseOver) {
            this.drawHoverState(bgCtx);
        }
        // Draw image
        this.canvasImage?.draw(asciiCtx, bgCtx);

        // Draw tags
        this.tagLabels.forEach((tagLabel: TagLabel) => {
            tagLabel.draw(bgCtx);
        });
    }

    drawHoverState(background: CanvasRenderingContext2D): void {
        this.drawBackgroundRect(
            this.pixelPosition.x - this.padding / 2,
            this.pixelPosition.y - this.pixelOffset.y - this.padding / 2,
            this.pixelSize.x + this.padding,
            this.pixelSize.y + this.padding,
            this.cornerRadius + this.padding / 2,
            true,
            new Color4(1, 1, 1, 0.8),
            background,
        );
    }

    onClick(): void {
        useSceneStore.getState().setNavigationSource(this.navigationSource);

        if (this.goTo) {
            this.goTo(`/work/${this.work.id}`);
            const setCursorState = useCursorStore.getState().setCursorState;
            setCursorState("default");
        }
    }

    onMouseEnter(): void {
        const setCursorState = useCursorStore.getState().setCursorState;
        setCursorState("pointer");

        this.isMouseOver = true;
        this.openTagLabels();
    }

    onMouseLeave(): void {
        const setCursorState = useCursorStore.getState().setCursorState;
        setCursorState("default");

        this.isMouseOver = false;
        this.closeTagLabels();
    }

    openTagLabels() {
        this.tagLabels.forEach((taglabel: TagLabel) => {
            taglabel.open();
        });
    }

    closeTagLabels() {
        this.tagLabels.forEach((taglabel: TagLabel) => {
            taglabel.close();
        });
    }

    destroy(): void {
        this.canvasImage?.destroy();
    }
}
