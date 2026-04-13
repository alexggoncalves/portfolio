import Color4 from "three/src/renderers/common/Color4.js";

import { CanvasImage } from "../../elements/canvas/CanvasImage";

import TagLabel from "../../elements/ui/TagLabel";
import type { NavigationSource } from "../../app/AppState";
import { InteractiveElement } from "../../elements/core/InteractiveElement";
import { RenderConfig } from "../../render/RenderConfig";
import { getTagsById, type Project, type Tag } from "../../app/contentAssets";

export class ProjectCard extends InteractiveElement {
    project: Project;
    
    canvasImage: CanvasImage | undefined;

    padding: number = 10;
    cornerRadius: number = 40;
    tagGap: number = 3;
    highlightColor: Color4 = new Color4(1, 1, 1, 0.8);

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
        padding?: number,
        cornerRadius?: number,
        goTo?: (path: string) => void,
        navigationSource?: NavigationSource,
    ) {
        super(x, y, "grid");
        this.setSize(w, h, "grid");

        this.project = project;
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
        const hMargin = 0 * RenderConfig.charSize.x;
        const vMargin = 2.4 * RenderConfig.charSize.x;

        let yPos = this.y;
        tags.forEach((tag: Tag) => {
            const x = this.x + this.w;

            const tagLabel = new TagLabel(
                tag,
                x - hMargin,
                yPos + vMargin,
                14,
                4,
                18,
            );
            this.tags.push(tagLabel);

            // Increment y offset
            yPos += tagLabel.getTagHeight() + this.tagGap;
        });
    }

    update(): void {
        super.update();

        if(this.isMouseOver && !this.tagsOpened){
            this.openTags();
            this.tagsOpened = true
        } else if(!this.isMouseOver && this.tagsOpened){
            this.closeTags();
            this.tagsOpened = false;
        }

        // Update image
        if (this.canvasImage) {
            this.canvasImage.setXOffset(this.gridOffsetX,"grid");
            this.canvasImage.setYOffset(this.gridOffsetY,"grid");
            this.canvasImage.opacity = this.opacity;
        }

        // Update tag labels
        this.tags.forEach((tag) => {
            tag.xOffset = this.offsetX;
            tag.yOffset = this.offsetY;
            tag.opacity = this.opacity;
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
        this.tags.forEach((tag) => {
            tag.draw(bgCtx);
        });
    }

    drawHoverState(background: CanvasRenderingContext2D): void {
        this.drawBackgroundRect(
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
        this.tags = undefined as any;
        this.goTo = undefined;

        super.destroy();
    }
}
