import { CanvasImage } from "../../elements/canvas/CanvasImage";

import TagLabel from "../../elements/ui/TagLabel";
import { AppState, type NavigationSource } from "../../app/AppState";
import { InteractiveElement } from "../../elements/core/InteractiveElement";
import { AsciiRenderConfig } from "../../app/AsciiRenderConfig";
import {
    getTagsById,
    type Project,
    type Tag,
} from "../../assets/contentAssets";
import type { Layer } from "../../elements/core/Layer";
import { Element } from "../../elements/core/Element";

export class ProjectCard extends InteractiveElement {
    project: Project;
    layer: Layer;

    canvasImage: CanvasImage | undefined;

    padding: number = 10;
    cornerRadius: number = 40;
    tagGap: number = 3;
    highlightColor: string = "rgba(255, 255, 255, 0.8)";

    navigationSource: NavigationSource = "home";
    goTo?: (path: string) => void;

    tagsOpened: boolean = false;
    tags: TagLabel[] = [];

    constructor(
        project: Project,
        x: number,
        y: number,
        w: number,
        h: number,
        layer: Layer,
        padding?: number,
        cornerRadius?: number,
        goTo?: (path: string) => void,
        navigationSource?: NavigationSource,
    ) {
        super(x, y, "grid");
        this.setSize(w, h, "grid");

        this.project = project;
        this.layer = layer;
        this.isInteractive = true;

        if (padding) this.padding = padding;
        if (cornerRadius) this.cornerRadius = cornerRadius;
        if (goTo) this.goTo = goTo;

        if (navigationSource) this.navigationSource = navigationSource;

        // Get work's tags and initialize label elements
        const tagObjects = getTagsById(this.project.tags);
        this.initializeTagLabels(tagObjects);

        // Create thumbnail
        if (project.thumbnailSrc) {
            this.canvasImage = new CanvasImage(
                project.thumbnailSrc,
                this.x,
                this.y,
                this.w,
                this.h,
                this.cornerRadius,
                "pixel",
            );
        }
    }

    initializeTagLabels(tags: Tag[]) {
        const hMargin = 0 * AsciiRenderConfig.charSize.x;
        const vMargin = 2.4 * AsciiRenderConfig.charSize.x;

        let yPos = this.y;
        tags.forEach((tag: Tag) => {
            const x = this.x + this.w;

            const tagLabel = new TagLabel(
                tag,
                x - hMargin,
                yPos + vMargin,
                "pixel",
                14,
                4,
                18,
                "right",
            );
            this.tags.push(tagLabel);
            this.layer.addElement(tagLabel);

            // Increment y offset
            yPos += tagLabel.getTagHeight() + this.tagGap;
        });
    }

    update(): void {
        super.update();

        if (this.isMouseOver && !this.tagsOpened) {
            this.openTags();
            this.tagsOpened = true;
        } else if (!this.isMouseOver && this.tagsOpened) {
            this.closeTags();
            this.tagsOpened = false;
        }

        // Update image
        if (this.canvasImage) {
            this.canvasImage.setXOffset(this.gridOffsetX, "grid");
            this.canvasImage.setYOffset(this.gridOffsetY, "grid");
            this.canvasImage.opacity = this.opacity;
        }

        this.setTagsXOffset();
    }

    setTagsXOffset() {
        this.tags.forEach((tag) => {
            tag.setXOffset(this.offsetX, "pixel");
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
    }

    drawHoverState(background: CanvasRenderingContext2D): void {
        Element.drawRect(
            this.x - this.offsetX - this.padding / 2,
            this.y - this.offsetY - this.padding / 2,
            this.w + this.padding,
            this.h + this.padding,
            this.cornerRadius + this.padding / 2,
            true,
            this.highlightColor,
            background,
        );
    }

    onClick(): void {
        super.onClick();
        if (this.goTo) {
            this.goTo(`/projects/${this.project.id}`);
            AppState.navigationSource = this.navigationSource;
        }
    }

    openTags() {
        this.tags.forEach((tag: TagLabel) => {
            tag.open();
        });
    }

    closeTags() {
        this.tags.forEach((tag: TagLabel) => {
            tag.close();
        });
    }

    destroy(): void {
        this.canvasImage?.destroy();
        this.canvasImage = undefined;

        this.goTo = () => {};

        if (!this.tags) return;
        this.tags.forEach((tag) => {
            this.layer.removeElement(tag);
            tag.destroy();
        });

        this.tags.length = 0;

        super.destroy();
    }
}
