import { ASCIILayer } from "../ASCIIField/ASCIILayer";
import { Vector2 } from "three";

///////////////////////////////////////////
// PAGE CLASS
///////////////////////////////////////////

export class ASCIIPage {
    name: string = "";
    layers: ASCIILayer[] = [];

    constructor(name: string, layers?: ASCIILayer[]) {
        this.name = name;

        if (layers) {
            this.layers = layers;
        }
    }

    draw(
        _ui: CanvasRenderingContext2D,
        _background: CanvasRenderingContext2D
    ): void {}

    update(
        ui: CanvasRenderingContext2D,
        background: CanvasRenderingContext2D,
        delta: number,
        mousePos: Vector2
        // _mouseDown?: boolean
    ): void {
        this.layers.forEach((layer: ASCIILayer) => {
            layer.update(delta, mousePos);
            layer.draw(ui, background);
        });
    }

    destroy(): void {}
}
