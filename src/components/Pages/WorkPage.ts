import { ASCIIPage } from "./ASCIIPage";
import { ASCIILayer } from "../ASCIIField/ASCIILayer";
import { Vector2, Color } from "three";
import { ASCIIBlock } from "../ASCIIField/ASCIIElement";
import Color4 from "three/src/renderers/common/Color4.js";

const title = 
`WORK`;

export class WorkPage extends ASCIIPage {
    constructor(layers?: ASCIILayer[]) {
        super("work", layers);
    }

    init(): void {
        const mainLayer = new ASCIILayer("work",[])

        mainLayer.addElement(
            new ASCIIBlock(
                title,
                new Vector2(5, 4),
                new Color("white"),
                new Color4(0, 0.4, 0.4, 0),
                "left",
                "top"
            )
        )

        this.layers.push(mainLayer);
    }

    update(
        ui: CanvasRenderingContext2D,
        background: CanvasRenderingContext2D,
        delta: number,
        mousePos: Vector2,
        // _mouseDown?: boolean
    ): void {
        this.layers.forEach((layer: ASCIILayer) => {
            layer.update(delta,mousePos)
            layer.draw(ui, background);
        });
    }
}
