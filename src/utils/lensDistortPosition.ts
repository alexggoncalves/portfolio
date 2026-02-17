import { Vector2 } from "three";

const lensDistortPosition = (
    pos: Vector2,
    canvasSize: { width: number; height: number; left: number; top: number },
) => {
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    // Step 1: Map viewport mouse to canvas coordinates inside the viewport
    const xInCanvas = (pos.x / viewportW) * viewportW; // stays in viewport scale
    const yInCanvas = (pos.y / viewportH) * viewportH;

    // Step 2: Normalize relative to the viewport area in canvas
    let nx = xInCanvas / viewportW;
    let ny = yInCanvas / viewportH;

    // Step 3: Apply lens distortion in normalized space
    const k = new Vector2(0.08, 0.18); // distortion
    const cx = 0.44;
    const cy = 0.42;

    let dx = nx - cx;
    let dy = ny - cy;
    const r2 = dx * dx + dy * dy;

    dx = dx * (1 + k.x * r2);
    dy = dy * (1 + k.y * r2);

    dx += cx;
    dy += cy;

    // Step 4: Convert back to canvas pixels **inside the viewport area**
    const xCanvas = dx * viewportW;
    const yCanvas = dy * viewportH;

    // Step 5: Add the canvas border offset to get final canvas coords
    const finalX = xCanvas + canvasSize.left;
    const finalY = yCanvas + canvasSize.top;

    return new Vector2(finalX, finalY);
};

export default lensDistortPosition;
