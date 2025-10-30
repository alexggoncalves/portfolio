import { Color, Vector2 } from "three";
import useAsciiStore from "../../stores/asciiStore";
import Color4 from "three/src/renderers/common/Color4.js";

const createBrightnessMap = (asciiSequence: string) => {
    const asciiArray = asciiSequence.split("");
    const map = new Map<string, number>();

    asciiArray.forEach((char, index) => {
        let mappedBrightness = index / (asciiArray.length - 0.9);
        // mappedBrightness = Math.pow(Number(mappedBrightness.toFixed(3)),1.0) 
        map.set(char, mappedBrightness);
    });
    // console.log([...map.entries()]);
    return map;
};

const brightnessMap = createBrightnessMap(
    useAsciiStore.getState().asciiSequence
);

const charSize = useAsciiStore.getState().charSize;

///////////////////////////////////////////
// ELEMENT CLASS
///////////////////////////////////////////

export class ASCIIElement {
    position: Vector2; // Position in relation to ascii grid
    size: Vector2 = new Vector2(1, 1); // Size in relation to ascii grid
    horizontalAlign: "left" | "center" | "right" = "left"; // Horizontal alignment
    verticalAlign: "top" | "middle" | "bottom" = "top"; // Vertical alignment

    // Colors
    color: Color = new Color("white");
    backgroundColor: Color4 = new Color4("transparent");
    opacity: number = 1.0;

    //Behaviour flags
    interactive: boolean = false;
    animated: boolean = false;
    needsUpdate: boolean = false;

    constructor(
        position: Vector2,
        color?: Color,
        backgroundColor?: Color4,
        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom"
    ) {
        this.position = position;
        if (color) this.color = color;
        if (backgroundColor) this.backgroundColor = backgroundColor;
        if (horizontalAlign) this.horizontalAlign = horizontalAlign;
        if (verticalAlign) this.verticalAlign = verticalAlign;
    }

    setSize(text: string): void;
    setSize(x: number, y: number): void;

    // Calculate ascii block size ([x]: max line lenght | [y]: number of lines)
    setSize(arg1: string | number, arg2?: number): void {
        if (typeof arg1 === "string") {
            const lines = (arg1.match(/\n/g) || "").length + 1;
            const maxlength = Math.max(
                ...arg1.split("\n").map((line) => line.length)
            );
            this.size.x = maxlength;
            this.size.y = lines;
        } else {
            this.size.x = arg1;
            if (arg2) this.size.y = arg2;
        }
    }

    setOpacity(value: number):void{
        this.opacity = value;
    }

    // Apply horizontal and vertical alignment
    applyAlignment() {
        const uiResolution = useAsciiStore.getState().uiResolution;
        const offset = new Vector2(0, 0);

        if (this.horizontalAlign === "right") {
            offset.x = uiResolution.x - this.size.x;
        } else if (this.horizontalAlign === "center") {
            offset.x = (uiResolution.x - this.size.x) / 2;
        }

        if (this.verticalAlign === "bottom") {
            offset.y = uiResolution.y - this.size.y;
        } else if (this.verticalAlign === "middle") {
            offset.y = (uiResolution.y - this.size.y) / 2;
        }

        this.position.x += offset.x;
        this.position.y += offset.y;
    }

    // Paint pixel on ui canvas
    drawPixel(
        x: number,
        y: number,
        color: Color4,
        ui: CanvasRenderingContext2D
    ): void {
        // Set color
        ui.fillStyle = `rgba(${color.r * 255 * this.opacity},
        ${color.g * 255 * this.opacity},
        ${color.b * 255 * this.opacity},
        ${color.a * this.opacity})`;

        // Clear and draw new character pixel
        ui.fillRect(x, y, 1, 1);
    }

    drawBlock(
        text: string,
        ui: CanvasRenderingContext2D,
        background: CanvasRenderingContext2D
    ) {
        let x = this.position.x;
        let y = this.position.y;

        for (let i = 0; i < text.length; i++) {
            const char = text.charAt(i);

            if (char != "\n") {
                //  Draw background pixel
                this.drawBackgroundTexel(
                    x,
                    y,
                    charSize.x,
                    charSize.y,
                    this.backgroundColor,
                    background
                );

                if (char != "") {
                    const brightness = brightnessMap.get(char);

                    if (brightness !== undefined) {
                        // Draw ui pixel
                        this.drawPixel(
                            x,
                            y,
                            new Color4(
                                this.color.r,
                                this.color.g,
                                this.color.b,
                                brightness
                            ),
                            ui
                        );
                    }
                }
                x++;
            } else {
                y++;
                x = this.position.x;
            }
        }
    }

    drawBackgroundTexel(
        x: number,
        y: number,
        w: number,
        h: number,
        color: Color4,
        context: CanvasRenderingContext2D
    ): void {
        // Set ui color
        context.fillStyle = `rgba(${color.r * 255 * this.opacity},
        ${color.g * 255 * this.opacity},
        ${color.b * 255 * this.opacity},
        ${color.a * this.opacity})`;

        // Clear and draw new character pixel
        context.clearRect(x * w, y * h, w, h);
        context.fillRect(x * w, y * h, w, h);
    }

    draw(
        _ui: CanvasRenderingContext2D,
        _background: CanvasRenderingContext2D
    ): void {}

    update(_delta?: number, _mousePos?: Vector2, _mouseDown?: boolean): void {}

    destroy(): void {}
}

///////////////////////////////////////////
// Ascii Block Class
///////////////////////////////////////////

export class ASCIIBlock extends ASCIIElement {
    text: string; // Ascii formated string

    constructor(
        text: string,
        position: Vector2,
        color: Color,
        backgroundColor: Color4,
        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom"
    ) {
        super(position, color, backgroundColor, horizontalAlign, verticalAlign);

        this.text = text;
        this.setSize(this.text);
        this.applyAlignment();
    }

    draw(
        ui: CanvasRenderingContext2D,
        background: CanvasRenderingContext2D
    ): void {
        this.drawBlock(this.text, ui, background);
    }

    update(): void {}

    fadeIn(): void {}

    fadeOut(): void {}
}

///////////////////////////////////////////
// Button Class
///////////////////////////////////////////

export class ASCIIButton extends ASCIIElement {
    text: string = ""; // Text to display on button
    domButton: HTMLButtonElement; // Html button dom element
    callback: () => void; // Button's function

    // flags
    isMouseOver: boolean = false;
    isMouseDown: boolean = false;

    constructor(
        text: string,
        callback: () => void,
        position: Vector2,
        color: Color,
        backgroundColor: Color4,

        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom"
    ) {
        super(position, color, backgroundColor, horizontalAlign, verticalAlign);

        this.text = text;
        this.interactive = true;
        this.callback = callback;

        this.setSize(this.text);
        this.applyAlignment();

        // Create html button
        this.domButton = document.createElement("button");
        this.domButton.classList.add("asciiButton")
        this.createHTML();
        document.body.appendChild(this.domButton);
    }

    createHTML(): void {
        const canvasOffset = useAsciiStore.getState().canvasOffset;
        const pixelRatio = useAsciiStore.getState().pixelRatio;

        // Create invisible html button
        ;
        this.domButton.textContent = this.text;
        this.domButton.style.left = `${
            this.position.x * (charSize.x / pixelRatio)
        }px`;
        this.domButton.style.top = `${
            this.position.y * (charSize.y / pixelRatio) - canvasOffset.y
        }px`;
        this.domButton.style.width = `${
            this.size.x * (charSize.y / pixelRatio)
        }px`;
        this.domButton.style.height = `${
            this.size.y * (charSize.y / pixelRatio)
        }px`;
        this.domButton.style.cursor = "pointer";

        // Set mouse event listeners
        this.domButton.addEventListener("click", () => this.onClick());
        this.domButton.addEventListener("mouseenter", () =>
            this.onMouseEnter()
        );
        this.domButton.addEventListener("mouseleave", () =>
            this.onMouseLeave()
        );
    }

    drawButtonFrame(
        strokeWeight: number,
        color: Color4,
        context: CanvasRenderingContext2D
    ): void {

        const x = this.position.x * charSize.x;
        const y = this.position.y * charSize.y;
        const w = this.size.x * charSize.x;
        const h = this.size.y * charSize.y;
        

        // Set color and stroke
        context.strokeStyle = `rgba(${color.r * 255},
        ${color.g * 255},
        ${color.b * 255},
        ${color.a * this.opacity})`;

        context.lineWidth = strokeWeight;

        // Draw rectangle
        context.strokeRect(x, y, w, h);
    }

    draw(
        ui: CanvasRenderingContext2D,
        background: CanvasRenderingContext2D
    ): void {
        this.drawBlock(this.text, ui, background);

        if (this.isMouseOver) {
            this.drawButtonFrame(1, new Color4(...this.color, 1), background);
        }
    }

    update(_delta?: number, _mousePos?: Vector2, _mouseDown?: boolean): void {}

    onClick(): void {
        if (this.callback) this.callback();
    }

    onMouseEnter(): void {
        this.isMouseOver = true;
    }

    onMouseLeave(): void {
        this.isMouseOver = false;
    }

    destroy() {
        this.domButton.removeEventListener("click", () => this.onClick?.());
        this.domButton.removeEventListener("mouseenter", () =>
            this.onMouseEnter?.()
        );
        this.domButton.removeEventListener("mouseleave", () =>
            this.onMouseLeave?.()
        );
        this.domButton.remove();
    }
}

///////////////////////////////////////////
// Ascii Screen Frame Class
///////////////////////////////////////////

export class ASCIIScreenFrame extends ASCIIElement {
    constructor(color: Color, backgroundColor: Color4) {
        super(new Vector2(0, 0), color, backgroundColor);
    }

    draw(
        ui: CanvasRenderingContext2D,
        _background: CanvasRenderingContext2D
    ): void {
        ui.fillStyle = `rgba(${this.color.r * 255},${this.color.g * 255}, ${
            this.color.b * 255
        },${0.1})`;

        ui.fillRect(2, 1, ui.canvas.width - 4, 1);
        ui.fillRect(1, 1, 1, ui.canvas.height - 2);
        ui.fillRect(ui.canvas.width - 2, 1, 1, ui.canvas.height - 2);
        ui.fillRect(2, ui.canvas.height - 2, ui.canvas.width - 4, 1);
    }

    update(): void {}

    fadeIn(): void {}

    fadeOut(): void {}
}

///////////////////////////////////////////
// Ascii Image Class
///////////////////////////////////////////

export class ASCIIImage extends ASCIIElement {
    image: CanvasImageSource; // Image to draw
    currentOpacity: number = 1; // 0 = fully background, 1 = fully UI
    targetOpacity: number = 1; // Opacity to fade to
    fadeSpeed: number = 0.02; // Opacity fade speed
    fadeRate: number = 4; // higher = faster fade
    startOpacity: number = 1; // store opacity at fade start
    fadeTimer: number = 0; // time since fade started
    fadeDuration: number = 2; // total fade time in seconds

    constructor(
        image: CanvasImageSource,
        position: Vector2,
        width: number,
        aspectRatio: number,
        horizontalAlign?: "left" | "center" | "right",
        verticalAlign?: "top" | "middle" | "bottom"
    ) {
        super(position,undefined,undefined,horizontalAlign,verticalAlign);
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
        ui.globalAlpha = this.currentOpacity * 1;

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
            data[i] = r * this.opacity;
            data[i + 1] = g * this.opacity;
            data[i + 2] = b * this.opacity;
            data[i + 3] = (brightness * this.currentOpacity) * this.opacity;
        }

        // Update image data
        ui.putImageData(imageData, this.position.x, this.position.y);

        ui.restore();
    }

    private drawImage(background: CanvasRenderingContext2D): void {
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
