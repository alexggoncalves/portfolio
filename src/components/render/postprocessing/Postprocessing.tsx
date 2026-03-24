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

    return (
        <>
            // Selective effects (canvas elements except images)
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
                    delay={new Vector2(10, 20)} // min and max glitch delay
                    duration={new Vector2(0.2, 0.4)} // min and max glitch duration
                    strength={new Vector2(0.02, 0.03)} // min and max glitch strength
                    chromaticAberrationOffset={new Vector2(0, 20)} // min and max chromatic aberration offset
                    mode={GlitchMode.SPORADIC} // glitch mode
                />
                <Vignette darkness={2} offset={-0.9} opacity={0.1} />

                <LensDistortion
                    distortion={new Vector2(distortion.x, distortion.y)}
                    principalPoint={new Vector2(0, 0)}
                    focalLength={new Vector2(focalLength.x, focalLength.y)}
                    skew={0}
                />

                {/* <Noise opacity={0.02} /> */}
            </EffectComposer>
        </>
    );
}

export default Postprocessing;
