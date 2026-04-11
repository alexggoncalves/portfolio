import { Vector2 } from "three";
import Color4 from "three/src/renderers/common/Color4.js";

import { CanvasImage } from "../../elements/canvas/CanvasImage";
import useAsciiStore from "../../../stores/asciiStore";

import type { Tag, Work } from "../../../stores/assetStore";
import useContentStore from "../../../stores/assetStore";
import useCursorStore from "../../../stores/pointerStore";

import TagLabel from "../../elements/ui/TagLabel";
import type { NavigationSource } from "../../../stores/sceneStore";
import useSceneStore from "../../../stores/sceneStore";
import { InteractiveElement } from "../../elements/core/InteractiveElement";

export class WorkCard extends InteractiveElement {
    work: Work;
    tagLabels: TagLabel[] = [];
    canvasImage: CanvasImage | undefined;
    padding: number = 10;
    cornerRadius: number = 40;
    tagGap: number = 3;
    highlightColor: Color4 = new Color4(1, 1, 1, 0.8);

    navigationSource: NavigationSource = "home";
    goTo?: (path: string) => void;

    tagsOpened: boolean = false;

    constructor(
        work: Work,
        position: Vector2,
        size: Vector2,
        padding?: number,
        cornerRadius?: number,
        goTo?: (path: string) => void,
        navigationSource?: NavigationSource,
    ) {
        super(position);
        this.work = work;
        this.setSize(size.x, size.y, "grid");
        this.isInteractive = true;

        if (padding) this.padding = padding;
        if (cornerRadius) this.cornerRadius = cornerRadius;
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
        const margin = new Vector2(0 * charSize.x, 2.4 * charSize.x);

        let yPos = this.pixelPosition.y;
        tags.forEach((tag: Tag) => {
            const x = this.pixelPosition.x + this.pixelSize.x;
            const tagLabel = new TagLabel(
                tag,
                new Vector2(x - margin.x, yPos + margin.y),
                15,
                new Vector2(10, 3),
            );
            this.tagLabels.push(tagLabel);

            // Increment y offset
            yPos += tagLabel.getTagHeight() + this.tagGap;
        });
    }

    update(): void {
        const mouseEnter = useCursorStore.getState().mouseEnter;
        const mouseLeave = useCursorStore.getState().mouseLeave;

        if (this.isMouseOver && !this.tagsOpened && this.active) {
            this.openTagLabels();
            this.tagsOpened = true;
            mouseEnter();
        } else if (!this.isMouseOver && this.tagsOpened) {
            this.closeTagLabels();
            this.tagsOpened = false;
            mouseLeave();
        }

        // Update image
        if (this.canvasImage) {
            this.canvasImage.setYOffset(this.gridOffset.y);
            this.canvasImage.setXOffset(this.gridOffset.x);
            this.canvasImage.opacity = this.opacity;
        }

        // Update tag labels
        this.tagLabels.forEach((tagLabel: TagLabel) => {
            tagLabel.opacity = this.opacity;
            tagLabel.yOffset = this.pixelOffset.y;
            tagLabel.xOffset = this.pixelOffset.x;
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
            this.pixelPosition.x - this.pixelOffset.x - this.padding / 2,
            this.pixelPosition.y - this.pixelOffset.y - this.padding / 2,
            this.pixelSize.x + this.padding,
            this.pixelSize.y + this.padding,
            this.cornerRadius + this.padding / 2,
            true,
            this.highlightColor,
            background,
        );
    }

    onClick(): void {
        useSceneStore.getState().setNavigationSource(this.navigationSource);

        if (this.goTo) {
            this.goTo(`/work/${this.work.id}`);
            const mouseLeave = useCursorStore.getState().mouseLeave;
            mouseLeave();
        }
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
        this.canvasImage = undefined;
        this.tagLabels = [];
        this.goTo = undefined

        super.destroy();
    }
}
