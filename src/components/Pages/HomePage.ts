import { Vector2, Color } from "three";
import Color4 from "three/src/renderers/common/Color4.js";

import { ASCIIPage } from "../ASCIIField/ASCIIPage";
import { ASCIILayer } from "../ASCIIField/ASCIILayer";
import { ASCIIBlock } from "../ASCIIField/ASCIIElement/ASCIIElement";

const title = 
`    :::     :::        :::::::::: :::    ::: 
  :+: :+:   :+:        :+:        :+:    :+: 
 +:+   +:+  +:+        +:+         +:+  +:+  
+#++:++#++: +#+        +#++:++#     +#++:+   
+#+     +#+ +#+        +#+         +#+  +#+  
#+#     #+# #+#        #+#        #+#    #+# 
###     ### ########## ########## ###    ### 


CREATIVE DEVELOPER`;

const titleMobile = 
`   :::    ::     :::::  ::    ::
  +: :+   :+     :+      +:  :+
 ++   ++  +:     +:       :++: 
+#+:++#+: +#     +#++#    #++#  
+#     #+ +#     +#      #+  +# 
#+     +# #+     #+     +#    #+
##     ## ###### ##### ##      ##


CREATIVE DEVELOPER`;

const cities =
`based in : Lisbon

from: Madeira
`

export class HomePage extends ASCIIPage {

    constructor(layers?: ASCIILayer[]) {
        super("home", layers);
    }

    init(isMobile: boolean): void {
        const mainLayer = new ASCIILayer("home",[])

        mainLayer.addElement(
            new ASCIIBlock(
                isMobile ? titleMobile : title,
                new Vector2(5, 4),
                new Color("white"),
                new Color4(0,0,0,0),
                "left",
                "top"
            )
        )

        mainLayer.addElement(
            new ASCIIBlock(
                cities,
                new Vector2(5,-4),
                new Color(1,1,1),
                new Color4(0.4,0.4,0.6,0.05),
                "left",
                "bottom" 
            )
        )

        this.layers.push(mainLayer);
    }
}
