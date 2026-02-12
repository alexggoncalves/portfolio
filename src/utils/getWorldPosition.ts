import type { Camera } from "@react-three/fiber";
import { Raycaster, Vector2, Vector3 } from "three";

type CoordSystem = "pixel" | "normalized" | "grid";

function getWorldPosition(
    coords: { x: number; y: number },
    distance: number,
    camera: Camera,
    canvasSize: { width: number; height: number },
    coordSystem: CoordSystem = "pixel",
    gridSize?: { width: number; height: number },
) {
    const normalizedCoords = new Vector3();

    switch (coordSystem) {
        case "pixel":
            normalizedCoords.x = (coords.x / canvasSize.width) * 2 - 1;
            normalizedCoords.y = (-coords.y / canvasSize.height) * 2 + 1;
            break;
        case "normalized":
            normalizedCoords.x = coords.x;
            normalizedCoords.y = coords.y;
            break;
        case "grid":
            if (!gridSize) gridSize = { width: 1, height: 1 };
            normalizedCoords.x = (coords.x / gridSize.width) * 2 - 1;
            normalizedCoords.y = (-coords.y / gridSize.height) * 2 + 1;
            break;
        default:
            throw new Error("Invalid coord system");
    }

    normalizedCoords.z = 0; // doesn't matter for perspective

    normalizedCoords.unproject(camera);

    // Move along view direction to desired Z
    const dir = normalizedCoords.sub(camera.position).normalize();
    const t = (distance - camera.position.z) / dir.z;

    return camera.position.clone().add(dir.multiplyScalar(t));
}

export default getWorldPosition;
