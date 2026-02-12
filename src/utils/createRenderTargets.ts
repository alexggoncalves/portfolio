import { CanvasTexture, NearestFilter, LinearFilter } from "three";

// Create context to draw in and use on the the GPU
export function createAsciiRenderTarget(width: number, height: number) {
    const canvas = document.createElement("canvas");
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;

    const context = canvas.getContext("2d", { alpha: true })!;
    context.imageSmoothingEnabled = false;
    context.globalAlpha = 1;

    const texture = new CanvasTexture(canvas);

    texture.magFilter = NearestFilter;
    texture.minFilter = NearestFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;

    return { texture, context };
}

export function createBackgroundRenderTarget(width: number, height: number) {
    const canvas = document.createElement("canvas");
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;

    const context = canvas.getContext("2d", { alpha: true })!;
    // context.imageSmoothingEnabled = true;
    // context.imageSmoothingQuality = "high";

    context.globalAlpha = 1;

    const texture = new CanvasTexture(canvas);

    texture.magFilter = LinearFilter;
    texture.minFilter = LinearFilter;
    texture.needsUpdate = true;

    return { texture, context };
}
