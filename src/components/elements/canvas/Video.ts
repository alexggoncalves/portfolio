import { Vector2 } from "three";
import { InteractiveElement } from "../core/InteractiveElement";
import type { Layer } from "../core/Layer";
import { Button } from "../ui/Button";
import { getIconById } from "../../app/contentAssets";
import { videos } from "../../app/assetRecords";
//------------------------------------------
// Ascii Image Class
//------------------------------------------

export class VideoPlayer extends InteractiveElement {
    layer: Layer;
    video: HTMLVideoElement | null = null; // Video to draw
    src: string;
    imageSize: Vector2 = new Vector2(0, 0);

    controlsHeight: number = 25; // controls size in pixels

    loaded = false;
    radius: number;

    isPlaying: boolean = false;

    constructor(
        layer: Layer,
        src: string,
        x: number,
        y: number,
        w: number,
        h: number,
        radius: number = 0,
        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom",
    ) {
        super(x, y,"grid",undefined, undefined, horizontalAlign, verticalAlign);

        this.layer = layer;
        this.isScrollable = true;
        this.radius = radius;
        this.src = src;

        this.setSize(w, h, "pixel");
        this.applyAlignment();

        this.zIndex = 2;
        this.hasPointerOnHover = false;
        layer.addElement(this);

        // Create controls
        this.createVideoControls();

        this.resolveVideo();
    }

    private resolveVideo() {
        const record = videos.get(this.src);

        if (record) {
            this.video = record.element;
            this.loaded = record.loaded;
        }
    }

    private play() {
        if (!this.loaded || !this.video) return;
        if (!this.isPlaying) {
            this.video.play();
            this.isPlaying = true;
            this.video.muted = false;
            this.video.volume = 1
            
        } else {
            this.video.pause();
            this.isPlaying = false;
        }
    }

    private createVideoControls() {
        const playIcon = getIconById("play");
        
        const x = this.x + this.controlsHeight/2;
        const y = this.y + this.h - this.controlsHeight - 1;

        if (playIcon) {
            const playButton = new Button(
                playIcon.src,
                () => this.play(),
                x,
                y,
                this.controlsHeight,
                this.controlsHeight,
                "pixel"
            );
            playButton.zIndex = 20;
            playButton.isScrollable = true;
            this.layer.addElement(playButton);
        }
    }

    draw(
        _asciiCtx: CanvasRenderingContext2D,
        bgCtx: CanvasRenderingContext2D,
    ): void {
        if (!this.loaded) {
            const record = videos.get(this.src);

            if (record?.loaded) {
                this.video = record.element;
                this.loaded = true;
            }
        }

        bgCtx.save();

        if (!this.loaded) {
            this.drawPlaceholder(bgCtx);
        } else {
            this.drawPlaceholder(bgCtx);
            this.drawVideo(bgCtx);
        }

        bgCtx.restore();
    }

    private drawVideo(bgCtx: CanvasRenderingContext2D): void {
        if (!this.loaded || !this.video) return;
        // Draw video to background canvas
        bgCtx.drawImage(
            this.video,
            this.x - this.offsetX,
            this.y - this.offsetY,
            this.w,
            this.h,
        );
    }

    private drawPlaceholder(bgCtx: CanvasRenderingContext2D): void {
        bgCtx.fillStyle = "#595959";

        // Draw image to "background" canvas
        bgCtx.fillRect(
            this.x - this.offsetX,
            this.y - this.offsetY,
            this.w,
            this.h,
        );
    }

    onClick(): void {
        if (!this.loaded || !this.video) return;
        if (this.video.paused) {
            this.video.play();
        } else if (!this.video.paused) {
            this.video.pause();
        }
    }

    destroy(): void {
        // stop video
        if (this.video) {
            this.video = null;
        }

        // reset state
        this.isPlaying = false;
        this.loaded = false;

        this.layer.destroy();
        this.layer = undefined as any;

        super.destroy();
    }
}
