import { Vector2 } from "three";
import type { Tag } from "../../../stores/assetStore";
// import useAsciiStore from "../../../stores/asciiStore";
import getColorString from "../../../utils/color";
import Color4 from "three/src/renderers/common/Color4.js";
import drawRoundRect from "../../../utils/drawRoundRect";

class TagLabel {
    position: Vector2;
    yOffset: number = 0;
    xOffset: number = 0;

    size: Vector2 | null = null;
    tag: Tag;
    textSize: Vector2 = new Vector2(0);
    textFont: string = "IBM Plex Mono";
    textWeight: number = 300;

    opacity: number = 1;
    padding: Vector2;

    isOpen = false;

    constructor(
        tag: Tag,
        position: Vector2,
        textHeight: number,
        padding: Vector2,
    ) {
        this.tag = tag;
        this.position = position;
        this.textSize.y = textHeight;
        this.padding = padding;
    }

    getTagHeight() {
        return this.textSize.y + this.padding.y * 2;
    }

    update() {}

    draw(bgCtx: CanvasRenderingContext2D) {
        // const { charSize } = useAsciiStore.getState();
        bgCtx.save();

        // Set text properties
        bgCtx.font = `${this.textWeight} ${this.textSize.y}px ${this.textFont}`;
        bgCtx.textRendering = "optimizeLegibility";
        bgCtx.textAlign = "center";
        bgCtx.textBaseline = "middle";
        bgCtx.fillStyle = "white";

        // Set tag size based on text size + padding
        if (!this.size) {
            this.size = this.calculateTagSize(bgCtx);
        }

        const x = this.position.x - this.xOffset - this.size.x + this.textSize.y / 2;
        const y = this.position.y - this.yOffset - this.textSize.y / 2;

        // Draw cross
        this.drawCross(
            bgCtx,
            this.position.x - this.xOffset - 2,
            y + this.textSize.y / 2 + this.padding.y,
        );

        // Draw background and text
        if (this.isOpen) {
            bgCtx.fillStyle = getColorString(
                new Color4(this.tag.color),
                this.opacity * 0.8,
            );
            // Draw container
            drawRoundRect(
                bgCtx,
                x,
                y,
                this.size.x,
                this.size.y,
                10,
            );

            // Draw text
            bgCtx.fillStyle = getColorString(new Color4("white"), this.opacity);
            bgCtx.fillText(
                this.tag.name.toUpperCase(),
                x + this.textSize.x / 2 + this.padding.x,
                y + this.textSize.y / 2 + this.padding.y,
            );
        }

        bgCtx.restore();
    }

    drawCross(bgCtx: CanvasRenderingContext2D, x: number, y: number) {
        if (!this.size) return;

        const radius = this.size.y * Math.cos(Math.PI / 3) - 4.4;

        bgCtx.beginPath();
        bgCtx.lineWidth = devicePixelRatio * 3;
        bgCtx.lineCap = "round";

        if (this.isOpen) {
            bgCtx.strokeStyle = `${getColorString(
                new Color4("white"),
                this.opacity,
            )}`;
        } else {
            bgCtx.strokeStyle = `${getColorString(
                new Color4(this.tag.color),
                this.opacity * 0.9,
            )}`;
        }
        bgCtx.moveTo(x - radius, y - radius);
        bgCtx.lineTo(x + radius, y + radius);

        bgCtx.moveTo(x + radius, y - radius);
        bgCtx.lineTo(x - radius, y + radius);

        bgCtx.stroke();
        bgCtx.closePath();
    }

    calculateTagSize(ctx: CanvasRenderingContext2D): Vector2 {
        this.textSize.x = ctx.measureText(this.tag.name.toUpperCase()).width;
        const width = this.textSize.x + this.padding.x * 2 + this.textSize.y;
        return new Vector2(width, this.getTagHeight());
    }

    open() {
        this.isOpen = true;
    }

    close() {
        this.isOpen = false;
    }
}

export default TagLabel;
