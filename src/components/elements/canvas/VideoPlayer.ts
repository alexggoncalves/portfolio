import { InteractiveElement } from "../core/InteractiveElement";
import type { Layer } from "../core/Layer";
import { Button } from "../ui/Button";
import { getIconById } from "../../assets/contentAssets";
import { videos } from "../../assets/assetRecords";
import { VideoProgressBar } from "../ui/VideoProgressBar";
//------------------------------------------
// Ascii Image Class
//------------------------------------------

export class VideoPlayer extends InteractiveElement {
    layer: Layer;
    video: HTMLVideoElement | null = null; // Video to draw
    src: string;

    controlsHeight: number = 25; // controls size in pixels
    barHeight: number = 6;
    margin: number = 12;

    loaded = false;
    radius: number;

    isPlaying: boolean = false;

    progressBar: VideoProgressBar | null = null;

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
        super(x, y, "grid", undefined, horizontalAlign, verticalAlign);

        this.layer = layer;
        this.isScrollable = true;
        this.radius = radius;
        this.src = src;

        this.setSize(w, h, "pixel");
        // this.applyAlignment();

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
            this.video.volume = 1;
        } else {
            this.video.pause();
            this.isPlaying = false;
        }
    }

    private createVideoControls() {
        const playIcon = getIconById("play");

        let x = this.x + this.controlsHeight / 2;
        let y = this.y + this.h - this.controlsHeight - 1;

        if (playIcon) {
            const playButton = new Button(
                playIcon.src,
                () => this.play(),
                x,
                y,
                this.controlsHeight,
                this.controlsHeight,
                "pixel",
            );
            playButton.zIndex = 20;
            playButton.isScrollable = true;
            this.layer.addElement(playButton);
        }

        x += this.controlsHeight + this.margin;

        this.progressBar = new VideoProgressBar(
            x,
            y + this.controlsHeight / 2 - this.barHeight * 1.5,
            this.w - this.controlsHeight * 4,
            this.barHeight,
            this.barHeight / 2,
        );

        this.progressBar.zIndex = 20;

        this.layer.addElement(this.progressBar);
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

    update(): void {
        super.update();

        // Update progress bar
        if (this.progressBar && this.video) {
            const currentTime = this.video.currentTime;
            const totalTime = this.video.duration;
            this.progressBar.updateTime(currentTime);
            this.progressBar.setTotalTime(totalTime);
        }

        // Update volume
        if (this.video) {
            if (this.isPlaying) {
                this.video.volume = this.opacity;
            }
        }
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
            this.video?.pause();
            this.video.currentTime = 0;
            this.video.remove();
            this.video = null;
        }

        if (this.progressBar) {
            this.progressBar.destroy();
            this.progressBar = null;
        }

        // reset state
        this.isPlaying = false;
        this.loaded = false;

        this.layer = undefined as any;

        super.destroy();
    }
}
