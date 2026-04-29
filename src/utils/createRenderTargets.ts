import { CanvasTexture} from "three";

// Create context to draw in and use on the the GPU
export function createAsciiRenderTarget(width: number, height: number) {
    const dpr = window.devicePixelRatio || 1;

    const canvas = document.createElement("canvas");
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const context = canvas.getContext("2d", { alpha: true })!;
    context.globalAlpha = 1;
    context.scale(dpr, dpr);

    const texture = new CanvasTexture(canvas);

    // texture.magFilter = NearestFilter;
    // texture.minFilter = NearestFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;

    return { texture, context };
}

export function createBgRenderTarget(width: number, height: number) {
    const dpr = window.devicePixelRatio || 1;

    const canvas = document.createElement("canvas");
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const context = canvas.getContext("2d", { alpha: true })!;

    context.globalAlpha = 1;
    context.scale(dpr, dpr);

    const texture = new CanvasTexture(canvas);

    // texture.magFilter = NearestFilter;
    // texture.minFilter = NearestFilter;
    texture.needsUpdate = true;

    return { texture, context };
}
