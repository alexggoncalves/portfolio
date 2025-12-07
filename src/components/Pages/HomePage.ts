import { Vector2, Color } from "three";
import Color4 from "three/src/renderers/common/Color4.js";

import { Page } from "../PageRenderer/Page";
import { Layer } from "../PageRenderer/Layer";
import { ASCIIBlock } from "../PageRenderer/Elements/Element";

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

export class HomePage extends Page {

    constructor(layers?: Layer[]) {
        super("home", layers);
    }

    init(isMobile: boolean): void {
        const mainLayer = new Layer("home",[])

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
