import { Color, Vector2 } from "three";
import type { Tag } from "../../../stores/assetStore";
import drawRoundRect from "../../../utils/drawRoundRect";

class TagLabel {
    position: Vector2;
    yOffset: number = 0;
    xOffset: number = 0;

    size: Vector2 | null = null;
    tagName: string;
    textSize: Vector2 = new Vector2(0);
    textFont: string = "IBM Plex Mono";
    textWeight: number = 300;

    opacity: number = 1;
    padding: Vector2;

    textColor: string = `rgba(255,255,255,1)`;
    tagColor: string;
    textStyle: string;

    isOpen = false;
    

    constructor(
        tag: Tag,
        position: Vector2,
        textHeight: number,
        padding: Vector2,
    ) {
        this.tagName = tag.name.toUpperCase();
        this.position = position;
        this.textSize.y = textHeight;
        this.padding = padding;
        const color = new Color(tag.color);
        this.tagColor = `rgba(${color.r * 255},${color.g * 255},${color.b * 255},0.7)`;
        this.textStyle = `${this.textWeight} ${this.textSize.y}px ${this.textFont}`
    }

    getTagHeight() {
        return this.textSize.y + this.padding.y * 2;
    }

    update() {}

    draw(bgCtx: CanvasRenderingContext2D) {
        // const { charSize } = useAsciiStore.getState();
        // Set text properties
        bgCtx.font = this.textStyle;
        bgCtx.textRendering = "optimizeLegibility";
        bgCtx.textAlign = "center";
        bgCtx.textBaseline = "middle";
        bgCtx.fillStyle = "white";

        // Set tag size based on text size + padding
        if (!this.size) {
            this.size = this.calculateTagSize(bgCtx);
        }

        const x =
            this.position.x - this.xOffset - this.size.x + this.textSize.y / 2;
        const y = this.position.y - this.yOffset - this.textSize.y / 2;

        // Draw cross
        this.drawCross(
            bgCtx,
            this.position.x - this.xOffset - 2,
            y + this.textSize.y / 2 + this.padding.y,
        );

        // Draw background and text
        if (this.isOpen) {
            bgCtx.fillStyle = this.tagColor;
            // Draw container
            drawRoundRect(bgCtx, x, y, this.size.x, this.size.y, 10);
            bgCtx.fill()

            // Draw text
            bgCtx.fillStyle = this.textColor;
            bgCtx.fillText(
                this.tagName,
                x + this.textSize.x / 2 + this.padding.x,
                y + this.textSize.y / 2 + this.padding.y,
            );
        }
    }

    drawCross(bgCtx: CanvasRenderingContext2D, x: number, y: number) {
        if (!this.size) return;

        const radius = this.size.y * Math.cos(Math.PI / 3) - 4.4;

        bgCtx.beginPath();
        bgCtx.lineWidth = 3;
        bgCtx.lineCap = "round";

        if (this.isOpen) {
            bgCtx.strokeStyle = this.textColor;
        } else {
            bgCtx.strokeStyle = this.tagColor;
        }
        bgCtx.moveTo(x - radius, y - radius);
        bgCtx.lineTo(x + radius, y + radius);

        bgCtx.moveTo(x + radius, y - radius);
        bgCtx.lineTo(x - radius, y + radius);

        bgCtx.stroke();
        bgCtx.closePath();
    }

    calculateTagSize(ctx: CanvasRenderingContext2D): Vector2 {
        this.textSize.x = ctx.measureText(this.tagName).width;
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
