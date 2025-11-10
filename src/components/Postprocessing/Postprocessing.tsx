import {
    // Bloom,
    ChromaticAberration,
    EffectComposer,
    Glitch,
    Noise,
    Vignette,
    // DepthOfField,
    // SMAA
} from "@react-three/postprocessing";
import { Vector2 } from "three";

import { GlitchMode } from "postprocessing";

import { AsciiEffect } from "./AsciiEffect";
// import { LensDistortion } from "./LensDistortion";

import useAsciiStore from "../../stores/asciiStore";

function Postprocessing() {
    const { fontAtlas, charSize, atlasGridSize, backgroundTexture, uiTexture } =
        useAsciiStore();

    return (
        <>
            <EffectComposer>
                <AsciiEffect
                    fontAtlasSrc={fontAtlas}
                    charSize={charSize}
                    atlasGridSize={atlasGridSize}
                    backgroundTexture={backgroundTexture!}
                    uiTexture={uiTexture!}
                ></AsciiEffect>
                <ChromaticAberration offset={[0.00004, 0.00004]} />
                {/* <LensDistortion
                    distortion={new Vector2(0.014, 0.014)}
                    principalPoint={new Vector2(0, 0)}
                    focalLength={new Vector2(0.98, 0.98)}
                    skew={0}

                /> */}
                <Noise opacity={0.02} />
                <Glitch
                    delay={new Vector2(3.5, 10)} // min and max glitch delay
                    duration={new Vector2(0.2, 0.5)} // min and max glitch duration
                    strength={new Vector2(0.02, 0.03)} // min and max glitch strength
                    chromaticAberrationOffset={new Vector2(0.5, 0.6)} // min and max chromatic aberration offset
                    mode={GlitchMode.SPORADIC} // glitch mode
                />

                <Vignette eskil={false} offset={0.3} darkness={0.2} />
            </EffectComposer>
        </>
    );
}

export default Postprocessing;
