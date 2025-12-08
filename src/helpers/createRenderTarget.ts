import { CanvasTexture, NearestFilter, LinearFilter } from "three";

// Create context to draw in and use on the the GPU
export function createAsciiRenderTarget(width: number, height: number) {
    const canvas = document.createElement("canvas");
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;

    const ctx = canvas.getContext("2d", { alpha: true })!;
    ctx.imageSmoothingEnabled = false;
    ctx.globalAlpha = 1;

    const texture = new CanvasTexture(canvas);

    texture.magFilter = NearestFilter;
    texture.minFilter = NearestFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;

    return { texture, ctx };
}

export function createBackgroundRenderTarget(width: number, height: number) {
    const canvas = document.createElement("canvas");
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;

    const ctx = canvas.getContext("2d", { alpha: true })!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.globalAlpha = 1;

    const texture = new CanvasTexture(canvas);

    texture.magFilter = LinearFilter;
    texture.minFilter = LinearFilter;
    texture.needsUpdate = true;

    return { texture, ctx };
}
