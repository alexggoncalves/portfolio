import { ASCIILayer } from "./ASCIILayer";
import { Vector2 } from "three";
import { MathUtils } from "three";

//----------------------------------
// PAGE CLASS
//----------------------------------

export class ASCIIPage {
    name: string = "";
    layers: ASCIILayer[] = [];
    opacity: number = 0.0;
    targetOpacity: number = 1.0;
    fadeSpeed: number = 5;

    onFadeOutComplete?: () => void;

    constructor(name: string, layers?: ASCIILayer[]) {
        this.name = name;

        if (layers) {
            this.layers = layers;
        }
    }

    init(_isMobile: boolean): void {}

    update(
        ui: CanvasRenderingContext2D,
        background: CanvasRenderingContext2D,
        delta: number,
        mousePos: Vector2
        // _mouseDown?: boolean
    ): void {
        // Lerp opacity for transitions
        this.opacity = MathUtils.damp(
            this.opacity,
            this.targetOpacity,
            this.fadeSpeed,
            delta
        );

        // Trigger the fade out completion event 
        // (to destroy the fading out page)
        if (this.targetOpacity === 0 && this.opacity <= 0) {
            this.onFadeOutComplete?.();
        }

        // Update and draw all page layers
        this.layers.forEach((layer: ASCIILayer) => {
            layer.update(ui, background, delta, mousePos, this.opacity);
        });
    }

    destroy(): void {
        this.layers.forEach((layer: ASCIILayer)=>{
            layer.destroy?.();
        })
    }

    
}
