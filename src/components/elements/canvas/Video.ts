import { Vector2 } from "three";
import { InteractiveElement } from "../core/InteractiveElement";
import type { Layer } from "../core/Layer";
import { Button } from "../ui/Button";
import useAssetStore from "../../../stores/assetStore";

//------------------------------------------
// Ascii Image Class
//------------------------------------------

export class CanvasVideo extends InteractiveElement {
    layer: Layer;
    video: HTMLVideoElement; // Video to draw
    imageSize: Vector2 = new Vector2(0, 0);

    controlsHeight: number = 25; // controls size in pixels

    loaded = false;
    radius: number;

    isPlaying: boolean = false;

    constructor(
        layer: Layer,
        src: string,
        position: Vector2,
        width: number, // width in ascii cells
        height: number, // height in ascii cells
        radius: number = 0,
        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom",
    ) {
        super(position, undefined, undefined, horizontalAlign, verticalAlign);
        this.layer = layer;
        this.isScrollable = true;
        this.setSize(width, height, "pixel");
        this.applyAlignment();

        this.radius = radius;
        this.zIndex = 2;
        this.hasPointerOnHover = false;
        layer.addElement(this);

        // Create controls
        this.createVideoControls();

        // Create video element
        this.video = document.createElement("video");
        this.video.crossOrigin = "anonymous";
        this.video.src = src;
        this.video.loop = true;
        this.video.muted = true;
        this.video.playsInline = true;
        this.video.addEventListener(
            "loadedmetadata",
            this.onVideoLoadedMetadata,
        );
    }

    private play() {
        if (!this.isPlaying) {
            this.video.play();
            this.isPlaying = true;
        } else {
            this.video.pause();
            this.isPlaying = false;
        }
    }

    private createVideoControls() {
        const getIconById = useAssetStore.getState().getIconById;
        const playIcon = getIconById("play");

        const placementPosition = new Vector2(
            this.pixelPosition.x,
            this.pixelPosition.y + this.pixelSize.y - this.controlsHeight,
        );
        if (playIcon) {
            const playButton = new Button(
                playIcon.src,
                () => this.play(),
                placementPosition.clone(),
                this.controlsHeight,
                this.controlsHeight,
                undefined,
                undefined,
                false,
            );
            playButton.zIndex = 20;
            playButton.isScrollable = true;
            this.layer.addElement(playButton);
        }
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
            this.drawPlaceholder(bgCtx);
            this.drawVideo(bgCtx);
        }

        bgCtx.restore();
    }

    private drawVideo(bgCtx: CanvasRenderingContext2D): void {
        // Draw video to background canvas
        bgCtx.drawImage(
            this.video,
            this.pixelPosition.x - this.pixelOffset.x,
            this.pixelPosition.y - this.pixelOffset.y,
            this.pixelSize.x,
            this.pixelSize.y,
        );
    }

    private drawPlaceholder(bgCtx: CanvasRenderingContext2D): void {
        bgCtx.fillStyle = "#595959";

        // Draw image to "background" canvas
        bgCtx.fillRect(
            this.pixelPosition.x - this.pixelOffset.x,
            this.pixelPosition.y - this.pixelOffset.y,
            this.pixelSize.x,
            this.pixelSize.y,
        );
    }

    

    onClick(): void {
        if (this.video.paused) {
            this.video.play();
        } else if (!this.video.paused) {
            this.video.pause();
        }
    }

    destroy(): void {
        // stop video
        if (this.video) {
            this.video.pause();
            this.video.removeAttribute("src");
            this.video.load(); // IMPORTANT: releases decoder
            this.video.removeEventListener(
                "loadedmetadata",
                this.onVideoLoadedMetadata,
            );
            this.video = undefined as any;
        }

        // reset state
        this.isPlaying = false;
        this.loaded = false;

        this.layer.destroy();
        this.layer = undefined as any

        super.destroy();
    }
}
