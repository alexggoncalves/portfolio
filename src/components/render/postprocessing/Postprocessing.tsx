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
import { RenderConfig } from "../RenderConfig";

function Postprocessing() {

    const principalPoint = useMemo(() => new Vector2(0, 0), []);

    return (
        <>
            <EffectComposer multisampling={0}>
                <AsciiEffect
                    fontAtlasSrc={RenderConfig.fontAtlas}
                    charSize={RenderConfig.charSize}
                    atlasGridSize={RenderConfig.atlasGridSize}
                    gridSize={RenderConfig.gridSize}
                ></AsciiEffect>

                <ChromaticAberration offset={[0.0, 0.0]} />
                {/* <Vignette darkness={2} offset={-0.9} opacity={0.1} /> */}

                <LensDistortion
                    distortion={RenderConfig.distortion}
                    principalPoint={principalPoint}
                    focalLength={RenderConfig.focalLength}
                    skew={0}
                />
            </EffectComposer>
        </>
    );
}

export default Postprocessing;
