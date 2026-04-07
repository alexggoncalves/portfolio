import type { Camera } from "@react-three/fiber";
import { Vector3 } from "three";

type CoordSystem = "pixel" | "normalized" | "grid";

const normalized = new Vector3();
const dir = new Vector3();
const result = new Vector3();

function getWorldPosition(
    coords: { x: number; y: number },
    distance: number,
    camera: Camera,
    canvasSize: { width: number; height: number },
    coordSystem: CoordSystem = "pixel",
    gridSize?: { width: number; height: number },
) {

    switch (coordSystem) {
        case "pixel":
            normalized.x = (coords.x / canvasSize.width) * 2 - 1;
            normalized.y = (-coords.y / canvasSize.height) * 2 + 1;
            break;
        case "normalized":
            normalized.x = coords.x;
            normalized.y = coords.y;
            break;
        case "grid":
            if (!gridSize) gridSize = { width: 1, height: 1 };
            normalized.x = (coords.x / gridSize.width) * 2 - 1;
            normalized.y = (-coords.y / gridSize.height) * 2 + 1;
            break;
        default:
            throw new Error("Invalid coord system");
    }

    normalized.z = 0; // doesn't matter for perspective

    normalized.unproject(camera);

    // Move along view direction to desired Z
    dir.copy(normalized).sub(camera.position).normalize();

    const t = (distance - camera.position.z) / dir.z;

    return result.copy(camera.position).add(dir.multiplyScalar(t));
}

export default getWorldPosition;
