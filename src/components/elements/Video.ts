import { Vector2 } from "three";
import { InteractiveElement } from "./InteractiveElement";

//------------------------------------------
// Ascii Image Class
//------------------------------------------

export class Video extends InteractiveElement {
    video: HTMLVideoElement; // Video to draw
    imageSize: Vector2 = new Vector2(0, 0);

    loaded = false;
    radius: number;

    constructor(
        src: string,
        position: Vector2,
        width: number, // width in ascii cells
        height: number, // height in ascii cells
        radius: number = 0,
        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom",
    ) {
        super(position, undefined, undefined, horizontalAlign, verticalAlign);
        this.isScrollable = true;
        this.setSize(width, height, "pixel");
        this.applyAlignment();

        this.radius = radius;

        this.video = document.createElement("video");
        this.video.crossOrigin = "anonymous";
        this.video.src = src;
        this.video.loop = true;
        this.video.muted = true;
        this.video.playsInline = true;

        this.video.addEventListener("loadedmetadata", this.onVideoLoadedMetadata);
    }

    private onVideoLoadedMetadata = () => {
        this.loaded = true;
        // this.video.play();
    };

    draw(
        _asciiCtx: CanvasRenderingContext2D,
        bgCtx: CanvasRenderingContext2D,
    ): void {
        if (!this.video) return;

        bgCtx.save();

        if (!this.loaded) {
            this.drawPlaceholder(bgCtx);
        } else {
            this.drawVideo(bgCtx);
        }

        bgCtx.restore();

        console.log(this.isMouseOver)
    }

    private drawVideo(bgCtx: CanvasRenderingContext2D): void {
        bgCtx.globalAlpha = this.opacity;

        // Draw video to background canvas
        bgCtx.drawImage(
            this.video,
            0,
            0,
            this.video.videoWidth,
            this.video.videoHeight,
            this.pixelPosition.x - this.pixelOffset.x,
            this.pixelPosition.y - this.pixelOffset.y,
            this.pixelSize.x,
            this.pixelSize.y,
        );
    }

    private drawPlaceholder(bgCtx: CanvasRenderingContext2D): void {
        bgCtx.globalAlpha = this.opacity;
        bgCtx.fillStyle = "#595959";

        // Draw image to "background" canvas
        bgCtx.fillRect(
            this.pixelPosition.x - this.pixelOffset.x,
            this.pixelPosition.y - this.pixelOffset.y,
            this.pixelSize.x,
            this.pixelSize.y,
        );
    }

    destroy(): void {
        // Remove references to image
        this.video.pause();
        this.video.onload = null;
        this.video.src = "";
        this.video = null as any;
        this.video.removeEventListener("loadedmetadata", this.onVideoLoadedMetadata);

        // Clear other references from parent class
        super.destroy();
    }

    onClick(): void {
        if (this.video.paused) {
            this.video.play();
        } else if(!this.video.paused) {
            this.video.pause();
        }
    }
}
