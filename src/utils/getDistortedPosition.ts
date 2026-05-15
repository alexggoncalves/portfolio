import { Vector2 } from "three";

// Transforms the mouse position to match
// the LensDistortion shader output.

const tempVec = new Vector2();

export function getDistortedPosition(
    mouse: { x: number; y: number },
    canvasSize: { width: number; height: number; left: number; top: number },
    distortion: { x: number; y: number } = { x: 0.02, y: 0.05 },
    focalLength: { x: number; y: number } = { x: 0.96, y: 0.9 },
    target = tempVec
) {
    // Map mouse to canvas relative pixels
    const canvasX = mouse.x + canvasSize.left;
    const canvasY = mouse.y + canvasSize.top;

    // Normalize relative to the canvas
    const nx = canvasX / canvasSize.width;
    const ny = canvasY / canvasSize.height;

    // Map to [-1 > 1] (Shader space)
    let xnX = nx * 2 - 1;
    let xnY = ny * 2 - 1;

    // Apply focal length
    xnX *= focalLength.x;
    xnY *= focalLength.y;

    // Apply distortion
    const dotXn = xnX * xnX + xnY * xnY;
    const xdX = xnX * (1 + distortion.x * dotXn);
    const xdY = xnY * (1 + distortion.y * dotXn);

    // Map back to [0 > 1]
    const distortedNX = xdX * 0.5 + 0.5;
    const distortedNY = xdY * 0.5 + 0.5;

    // Convert back to Canvas Pixels
    target.set(distortedNX * canvasSize.width, distortedNY * canvasSize.height)

    return target;
}

export function undistortUV(
    uv: Vector2,
    {
      distortion,
      focalLength,
    }: {
      distortion: { x: number; y: number };
      focalLength: { x: number; y: number };
    }
  ) {
    let x = uv.x;
    let y = uv.y;
  
    // iterative inverse
    for (let i = 0; i < 4; i++) {
      let xnX = x * 2 - 1;
      let xnY = y * 2 - 1;
  
      xnX *= focalLength.x;
      xnY *= focalLength.y;
  
      const r2 = xnX * xnX + xnY * xnY;
  
      const xdX = xnX * (1 + distortion.x * r2);
      const xdY = xnY * (1 + distortion.y * r2);
  
      const projectedX = xdX * 0.5 + 0.5;
      const projectedY = xdY * 0.5 + 0.5;
  
      x -= (projectedX - uv.x);
      y -= (projectedY - uv.y);
    }
  
    return new Vector2(x, y);
  }