import {
    ChromaticAberration,
    EffectComposer,
    // Glitch,
    // Vignette,
} from "@react-three/postprocessing";
// import { GlitchMode } from "postprocessing";
import { AsciiEffect } from "./AsciiEffect";
import { LensDistortion } from "./LensDistortion";
import { Vector2 } from "three";

import { useMemo } from "react";
import { AsciiRenderConfig } from "../app/RenderConfig";

function Postprocessing() {

    const principalPoint = useMemo(() => new Vector2(0, 0), []);

    return (
        <>
            <EffectComposer multisampling={0}>
                <AsciiEffect
                    fontAtlasSrc={AsciiRenderConfig.fontAtlas}
                    charSize={AsciiRenderConfig.charSize}
                    atlasGridSize={AsciiRenderConfig.atlasGridSize}
                    gridSize={AsciiRenderConfig.gridSize}
                ></AsciiEffect>

                <ChromaticAberration offset={[0.0, 0.0]} />
                {/* <Vignette darkness={2} offset={-0.9} opacity={0.1} /> */}

                <LensDistortion
                    distortion={AsciiRenderConfig.distortion}
                    principalPoint={principalPoint}
                    focalLength={AsciiRenderConfig.focalLength}
                    skew={0}
                />
            </EffectComposer>
        </>
    );
}

export default Postprocessing;
