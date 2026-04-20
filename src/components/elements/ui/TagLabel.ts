import { Color } from "three";
import drawRoundRect from "../../../utils/drawRoundRect";
import type { Tag } from "../../assets/contentAssets";
import { Element, type Unit } from "../core/Element";

class TagLabel extends Element {
    tagName: string;

    textW: number = 1;
    textH: number;

    vPadding: number;
    hPadding: number;

    textFont: string = "IBM Plex Mono";
    textWeight: number = 400;
    textColor: string = `rgba(255,255,255,1)`;
    tagColor: string;
    textStyle: string;

    crossRadius: number = 1;

    isToggleable: boolean = true;

    isOpen = false;
    initialized = false;

    opacity: number = 1;

    constructor(
        tag: Tag,
        x: number,
        y: number,
        unit: Unit = "pixel",
        textHeight: number,
        vPadding: number,
        hPadding: number,
        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom",
    ) {
        super(x, y, unit, undefined, undefined, horizontalAlign, verticalAlign);

        this.tagName = tag.name.toUpperCase();

        this.textH = textHeight;
        this.vPadding = vPadding;
        this.hPadding = hPadding;
        this.isScrollable = true;

        const color = new Color(tag.color);
        this.tagColor = `rgba(${color.r * 255},${color.g * 255},${color.b * 255},0.8)`;
        this.textStyle = `${this.textWeight} ${this.textH}px ${this.textFont}`;
    }

    getTagHeight() {
        return this.textH + this.vPadding * 2;
    }

    getTagWidth() {
        return this.textW + this.hPadding * 2;
    }

    draw(_asciiCtx: CanvasRenderingContext2D, bgCtx: CanvasRenderingContext2D) {
        bgCtx.font = this.textStyle;
        bgCtx.textAlign = "left";
        bgCtx.textBaseline = "middle";
        bgCtx.fillStyle = "white";

        if (!this.initialized) {
            this.textW = bgCtx.measureText(this.tagName).width;
            const w = this.getTagWidth();
            const h = this.getTagHeight();

            this.setSize(w, h, "pixel");
            this.crossRadius = h * Math.cos(Math.PI / 3) - 4.3;
            this.initialized = true;
        }

        let x = this.x - this.offsetX;
        let y = this.y - this.offsetY;

        // Align cross
        if (this.horizontalAlign === "left") x += this.h / 2; // Offset cross to align left

        // Draw cross
        this.drawCross(bgCtx, x, y, this.crossRadius);

        // Draw background and text
        if (this.isOpen || !this.isToggleable) {
            y -= this.textH / 2 + this.vPadding; // Align text and container to cross

            bgCtx.fillStyle = this.tagColor;
            if (this.horizontalAlign === "left") {
                // Draw container
                drawRoundRect(
                    bgCtx,
                    x - this.h / 2,
                    y,
                    this.w,
                    this.h,
                    this.h / 2,
                );
                bgCtx.fill();
                
                // Draw text
                bgCtx.fillStyle = this.textColor;
                bgCtx.fillText(
                    this.tagName,
                    x + this.hPadding/2 + this.crossRadius,
                    y + this.textH / 2 + this.vPadding,
                );
            } else {
                x -= this.w - this.h / 2;
                // Draw container
                drawRoundRect(bgCtx, x, y, this.w, this.h, this.h / 2);
                bgCtx.fill();
                // Draw text
                bgCtx.fillStyle = this.textColor;
                bgCtx.fillText(
                    this.tagName,
                    x + this.hPadding / 2,
                    y + this.textH / 2 + this.vPadding,
                );
            }
        }
    }

    drawCross(
        bgCtx: CanvasRenderingContext2D,
        x: number,
        y: number,
        radius: number,
    ) {
        if (!this.h) return;

        bgCtx.beginPath();
        bgCtx.lineWidth = 3;
        bgCtx.lineCap = "round";

        if (this.isOpen || !this.isToggleable) {
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
