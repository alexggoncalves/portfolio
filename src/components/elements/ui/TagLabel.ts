import { Color } from "three";
import drawRoundRect from "../../../utils/drawRoundRect";
import type { Tag } from "../../app/contentAssets";

class TagLabel {
    tagName: string;

    x: number;
    y: number;
    yOffset: number = 0;
    xOffset: number = 0;

    w: number | null = null;
    h: number | null = null;
    textW: number = 1;
    textH: number;

    vPadding: number;
    hPadding: number;

    textFont: string = "IBM Plex Mono";
    textWeight: number = 400;
    textColor: string = `rgba(255,255,255,1)`;
    tagColor: string;
    textStyle: string;

    isOpen = false;

    opacity: number = 1;

    constructor(
        tag: Tag,
        x: number,
        y: number,
        textHeight: number,
        vPadding: number,
        hPadding: number,
    ) {
        this.tagName = tag.name.toUpperCase();
        this.x = x;
        this.y = y;

        this.textH = textHeight;
        this.vPadding = vPadding;
        this.hPadding = hPadding;
        
        const color = new Color(tag.color);
        this.tagColor = `rgba(${color.r * 255},${color.g * 255},${color.b * 255},0.8)`;
        this.textStyle = `${this.textWeight} ${this.textH}px ${this.textFont}`;
    }

    getTagHeight() {
        return this.textH + this.vPadding * 2;
    }

    getTagWidth() {
        return this.textW + this.hPadding * 2
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

        if(!this.w || !this.h) {
            this.textW = bgCtx.measureText(this.tagName).width

            this.w = this.getTagWidth();
            this.h = this.getTagHeight();
        }

        const x = this.x - this.w - this.xOffset + this.h/2;
        const y = this.y - this.textH / 2  - this.yOffset;

        // Draw cross
        this.drawCross(
            bgCtx,
            this.x - this.xOffset,
            y + this.textH / 2 + this.vPadding,
        );

        // Draw background and text
        if (this.isOpen) {
            bgCtx.fillStyle = this.tagColor;
            // Draw container
            drawRoundRect(bgCtx, x, y, this.w, this.h, this.h/2);
            bgCtx.fill();

            // Draw text
            bgCtx.fillStyle = this.textColor;
            bgCtx.fillText(
                this.tagName,
                x + this.textW / 2 + this.hPadding/2,
                y + this.textH / 2 + this.vPadding,
            );
        }
    }

    drawCross(bgCtx: CanvasRenderingContext2D, x: number, y: number) {
        if(!this.h) return;
        
        const radius = this.h * Math.cos(Math.PI / 3) - 4.4;

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

    open() {
        this.isOpen = true;
    }

    close() {
        this.isOpen = false;
    }
}

export default TagLabel;
