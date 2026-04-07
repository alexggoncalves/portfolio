import {
    ChromaticAberration,
    EffectComposer,
    Glitch,
    Vignette,
} from "@react-three/postprocessing";
import { GlitchMode } from "postprocessing";
import { AsciiEffect } from "./AsciiEffect";
import { LensDistortion } from "./LensDistortion";
import { Vector2 } from "three";

import useAsciiStore from "../../../stores/asciiStore";
import useSceneStore from "../../../stores/sceneStore";
import { useMemo } from "react";

function Postprocessing() {
    const {
        fontAtlas,
        charSize,
        atlasGridSize,
        backgroundTexture,
        uiTexture,
        gridSize,
    } = useAsciiStore();

    const { distortion, focalLength } = useSceneStore();

    const distortionVec = useMemo(
        () => new Vector2(distortion.x, distortion.y),
        [distortion.x, distortion.y],
    );

    const principalPoint = useMemo(() => new Vector2(0, 0), []);

    const focalLengthVec = useMemo(
        () => new Vector2(focalLength.x, focalLength.y),
        [focalLength.x, focalLength.y],
    );

    const glitchDelay = useMemo(() => new Vector2(10, 20), []);
    const glitchDuration = useMemo(() => new Vector2(0.2, 0.4), []);
    const glitchStrength = useMemo(() => new Vector2(0.02, 0.03), []);
    const glitchOffset = useMemo(() => new Vector2(0, 20), []);

    return (
        <>
            <EffectComposer multisampling={0}>
                <AsciiEffect
                    fontAtlasSrc={fontAtlas}
                    charSize={charSize}
                    atlasGridSize={atlasGridSize}
                    backgroundTexture={backgroundTexture!}
                    uiTexture={uiTexture!}
                    gridSize={gridSize}
                ></AsciiEffect>

                <ChromaticAberration offset={[0.0, 0.0]} />
                <Glitch
                    delay={glitchDelay} // min and max glitch delay
                    duration={glitchDuration} // min and max glitch duration
                    strength={glitchStrength} // min and max glitch strength
                    chromaticAberrationOffset={glitchOffset} // min and max chromatic aberration offset
                    mode={GlitchMode.SPORADIC} // glitch mode
                />
                <Vignette darkness={2} offset={-0.9} opacity={0.1} />

                <LensDistortion
                    distortion={distortionVec}
                    principalPoint={principalPoint}
                    focalLength={focalLengthVec}
                    skew={0}
                />
            </EffectComposer>
        </>
    );
}

export default Postprocessing;
