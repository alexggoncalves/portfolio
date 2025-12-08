import { Color } from "three";
import Color4 from "three/src/renderers/common/Color4.js";

import { ASCIIScreenFrame } from "../PageRenderer/Elements/ASCIIFrame";
import { Layer } from "../PageRenderer/Layer";

//-------------------------------
//          FRAME LAYER
//-------------------------------

export class Frame extends Layer {
    constructor() {
        super("frame", []);
    }

    init(): void {
        this.addElement(
            new ASCIIScreenFrame(new Color(1, 1, 1), new Color4("transparent"))
        );
    }
}
