import { Color, Vector2 } from "three";
import useAsciiStore from "../stores/asciiStore";
import Color4 from "three/src/renderers/common/Color4.js";

const createBrightnessMap = (asciiSequence: string) => {
    const asciiArray = asciiSequence.split("");
    const map = new Map<string, number>();

    asciiArray.forEach((char, index) => {
        const mappedBrightness = index / (asciiArray.length - 1.9);
        map.set(char, mappedBrightness);
    });

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
    position: Vector2;
    size: Vector2 = new Vector2(1, 1);
    color: Color = new Color("white");
    backgroundColor: Color4 = new Color4("transparent");
    alignment: string = "left";
    opacity: number = 1.0;

    //Behaviour flags
    interactive: boolean = false;
    animated: boolean = false;

    needsUpdate: boolean = false;

    constructor(
        position: Vector2,
        color?: Color,
        backgroundColor?: Color4
        // alignment: "left"
    ) {
        this.position = position;
        if (color) this.color = color;
        if (backgroundColor) this.backgroundColor = backgroundColor;

        // this.alignment = alignment;
    }

    setSize(text: string): void {
        const lines = (text.match(/\n/g) || "").length + 1;
        const maxlength = Math.max(
            ...text.split("\n").map((line) => line.length)
        );
        this.size.x = maxlength;
        this.size.y = lines;
    }

    draw(
        _ui: CanvasRenderingContext2D,
        _background: CanvasRenderingContext2D
    ): void {}

    update(_delta?: number, _mousePos?: Vector2, _mouseDown?: boolean): void {}

    drawPixel(
        x: number,
        y: number,
        color: Color4,
        context: CanvasRenderingContext2D
    ): void {
        // Set ui color
        context.fillStyle = `rgba(${color.r * 255},
        ${color.g * 255},
        ${color.b * 255},
        ${color.a * this.opacity})`;

        // Clear and draw new character pixel
        context.clearRect(x, y, 1, 1);
        context.fillRect(x, y, 1, 1);
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
        context.fillStyle = `rgba(${color.r * 255},
        ${color.g * 255},
        ${color.b * 255},
        ${color.a * this.opacity})`;

        // Clear and draw new character pixel
        context.clearRect(x * w, y * h, w, h);
        context.fillRect(x * w, y * h, w, h);
    }

    destroy(): void {}
}

///////////////////////////////////////////
// Button Class
///////////////////////////////////////////

export class ASCIIButton extends ASCIIElement {
    text: string = "";
    domButton: HTMLButtonElement;
    callback?: () => void;

    // flags
    isMouseOver: boolean = false;

    constructor(
        text: string,
        position: Vector2,
        color: Color,
        backgroundColor: Color4,
        callback?: () => void
        // alignment?: ASCIIElementAlignment
    ) {
        super(position, color, backgroundColor);

        this.text = text;
        this.interactive = true;
        this.callback = callback;

        this.setSize(this.text);

        const canvasOffset = useAsciiStore.getState().canvasOffset;

        // Create invisible html button
        this.domButton = document.createElement("button");
        this.domButton.classList.add("asciiButton");
        this.domButton.textContent = this.text;
        this.domButton.style.left = `${
            this.position.x * (charSize.x / window.devicePixelRatio)
        }px`;
        console.log(" aa", canvasOffset);
        this.domButton.style.top = `${
            this.position.y * (charSize.y / window.devicePixelRatio) -
            canvasOffset.y
        }px`;
        this.domButton.style.width = `${
            this.size.x * (charSize.y / devicePixelRatio)
        }px`;
        this.domButton.style.height = `${
            this.size.y * (charSize.y / devicePixelRatio)
        }px`;
        this.domButton.style.cursor = "pointer";
        document.body.appendChild(this.domButton);

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

        // Set ui color
        context.strokeStyle = `rgba(${color.r * 255},
        ${color.g * 255},
        ${color.b * 255},
        ${color.a * this.opacity})`;

        context.lineWidth = strokeWeight;

        context.strokeRect(x, y, w, h);
    }

    onClick(): void {
        console.log("click");

        if (this.callback) this.callback();
    }

    onMouseEnter(): void {
        this.isMouseOver = true;
    }
    onMouseLeave(): void {
        this.isMouseOver = false;
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
// Ascii Block Class
///////////////////////////////////////////

export class ASCIIBlock extends ASCIIElement {
    text: string;

    constructor(
        text: string,
        position: Vector2,
        color: Color,
        backgroundColor: Color4
    ) {
        super(position, color, backgroundColor);

        this.text = text;
        this.setSize(this.text);
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
    currentOpacity: number = 0; // 0 = fully background, 1 = fully UI
    targetOpacity: number = 1; // Opacity to fade to
    fadeSpeed: number = 0.01; // Opacity fade speed
    fadeRate: number = 2; // higher = faster fade
    startOpacity: number = 0; // store opacity at fade start
    fadeTimer: number = 0; // time since fade started
    fadeDuration: number = 1; // total fade time in seconds

    constructor(
        position: Vector2,
        image: CanvasImageSource,
        width: number,
        aspectRatio: number
    ) {
        super(position);
        this.image = image;
        this.size = new Vector2(width, width / aspectRatio);
        this.animated = true;
        this.interactive = true;
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
            data[i + 3] = brightness * this.currentOpacity;
        }

        // Update image data
        ui.putImageData(imageData, this.position.x, this.position.y);

        ui.restore();
    }

    private drawImage(background: CanvasRenderingContext2D): void {
        // Draw background (full picture)
        background.save();
        background.globalAlpha = 1 - this.currentOpacity;

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

    fadeIn(): void {
        this.startOpacity = this.currentOpacity;
        this.targetOpacity = 1;
        this.fadeTimer = 0;
    }

    fadeOut(): void {
        this.startOpacity = this.currentOpacity;
        this.targetOpacity = 0;
        this.fadeTimer = 0;
    }
}
