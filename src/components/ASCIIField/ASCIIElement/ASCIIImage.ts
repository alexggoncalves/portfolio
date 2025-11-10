import { Vector2 } from "three";
import useAsciiStore from "../../../stores/asciiStore";

import { ASCIIElement } from "./ASCIIElement";

//------------------------------------------
// Ascii Image Class
//------------------------------------------

export class ASCIIImage extends ASCIIElement {
    image: CanvasImageSource; // Image to draw

    currentOpacity: number = 1; // 0 = fully UI , 1 = fully background
    targetOpacity: number = 0;
    startOpacity: number = 1;
    fadeTimer: number = 0;
    fadeDuration: number = 0.6;

    constructor(
        image: CanvasImageSource,
        position: Vector2,
        width: number,
        aspectRatio: number,
        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom"
    ) {
        super(position, undefined, undefined, horizontalAlign, verticalAlign);
        this.image = image;

        this.animated = true;
        this.interactive = true;

        this.setSize(width, width / aspectRatio);
        this.applyAlignment();
    }

    draw(
        ui: CanvasRenderingContext2D,
        background: CanvasRenderingContext2D
    ): void {
        if (!this.image) {
            return;
        }
        this.drawImage(background);
        this.drawAscii(ui);
    }

    private drawAscii(ui: CanvasRenderingContext2D): void {
        // Draw ui (picture converted to pixels for ascii shader)
        ui.save();
        // ui.globalAlpha = this.currentOpacity * this.opacity;
        ui.globalAlpha = 0.5;
        // Pixelate image on the canvas
        ui.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.size.x,
            this.size.y
        );

        // Retrieve image data  [r,g,b,a,r,g,b,a,...]
        const imageData = ui.getImageData(
            this.position.x,
            this.position.y,
            this.size.x,
            this.size.y
        );
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            // Calculate the brightness of each pixel
            const brightness = r * 0.299 + g * 0.587 + b * 0.114;

            // Set brightness as the alpha for the ascii renderer (combined with the current opacity)
            data[i] = r * (1-this.currentOpacity);
            data[i + 1] = g * (1-this.currentOpacity);
            data[i + 2] = b * (1-this.currentOpacity);
            data[i + 3] = brightness * (1-this.currentOpacity);
        }

        // Update image data
        ui.putImageData(imageData, this.position.x, this.position.y);

        ui.restore();
    }

    private drawImage(background: CanvasRenderingContext2D): void {
        const charSize = useAsciiStore.getState().charSize;

        // Draw background (full picture)
        background.save();
        background.globalAlpha = (1 - this.currentOpacity) * this.opacity;
        background.drawImage(
            this.image,
            this.position.x * charSize.x,
            this.position.y * charSize.y,
            this.size.x * charSize.x,
            this.size.y * charSize.y
        );

        // Restore global alpha
        background.restore();
    }

    easeInOutSine(t: number): number {
        t = Math.max(0, Math.min(1, t));
        return -(Math.cos(Math.PI * t) - 1) / 2;
    }

    update(delta: number): void {
        if (this.currentOpacity === this.targetOpacity) return;

        // Increment timer
        this.fadeTimer += delta;
        const t = Math.min(this.fadeTimer / this.fadeDuration, 1); // normalized 0→1

        // Apply easing (ease in/out sine)
        const eased = this.easeInOutSine(t);

        // Interpolate from start to target
        this.currentOpacity =
            this.startOpacity +
            (this.targetOpacity - this.startOpacity) * eased;
    }

    fadeToAscii(): void {
        this.startOpacity = this.currentOpacity;
        this.targetOpacity = 1;
        this.fadeTimer = 0;
    }

    fadeToFullImage(): void {
        this.startOpacity = this.currentOpacity;
        this.targetOpacity = 0;
        this.fadeTimer = 0;
    }
}
