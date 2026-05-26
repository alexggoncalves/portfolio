import type { Object3D } from "three";

export const NORMAL_ASCII_LAYER = 0;
export const FORCED_ASCII_LAyer = 1;

// Place all children of an element in a camear layer
export function setRenderLayer(
    root: Object3D | null,
    layer: number,
): void {
    if (!root) return;
    root.traverse((obj) => {
        obj.layers.set(layer);
    });
}
