import {
    Box3,
    Object3D,
    OrthographicCamera,
    PerspectiveCamera,
    Vector3,
} from "three";
import { degToRad } from "three/src/math/MathUtils.js";

type CoordSystem = "pixel" | "normalized" | "grid";

export function getWorldScale(
    targetSize: { width?: number; height?: number },
    objectSize: Vector3,
    distance: number,
    camera: OrthographicCamera | PerspectiveCamera,
    canvasSize: { width: number; height: number },
    coordSystem: CoordSystem = "pixel",
    charSize?: { width: number; height: number },
) {
    if (!charSize) charSize = { width: 1, height: 1 };

    let worldScale = new Vector3(1);

    let targetWidth;
    let targetHeight;

    if (targetSize.width && !targetSize.height) {
        targetWidth = targetSize.width;
        targetHeight = (targetWidth / objectSize.x) * objectSize.y;
    } else if (!targetSize.width && targetSize.height) {
        targetHeight = targetSize.height;
        targetWidth = (targetHeight / objectSize.y) * objectSize.x;
    } else {
        targetWidth = targetSize.width || 1;
        targetHeight = targetSize.height || 1;
    }

    // Adjust size for grid coord system
    if (coordSystem === "grid") {
        targetWidth *= charSize.width; // width in pixels
        targetHeight *= charSize.height; // height in pixels
    }

    if (camera instanceof OrthographicCamera) {
        console.warn("Orthographic camera not supported for object scaling");
        return worldScale;
    }

    // Calculate frustum size at object's distance
    const fov = degToRad(camera.fov);
    const worldHeight = 2 * Math.tan(fov / 2) * distance;
    const worldWidth = worldHeight * camera.aspect;

    // Convert pixels to world scale units
    const unitsPerPixelX = worldWidth / canvasSize.width;
    const unitsPerPixelY = worldHeight / canvasSize.height;

    const scaleX = (targetWidth * unitsPerPixelX) / objectSize.x;
    const scaleY = (targetHeight * unitsPerPixelY) / objectSize.y;

    return new Vector3(scaleX, scaleY);
}

export function getObjectSize(object: Object3D) {
    const box = new Box3().setFromObject(object);
    const size = box.getSize(new Vector3());

    return size;
}

export default getWorldScale;
