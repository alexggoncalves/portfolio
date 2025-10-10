import {
    Bloom,
    ChromaticAberration,
    EffectComposer,
    Glitch,
    Noise,
} from "@react-three/postprocessing";
import { Vector2 } from "three";

import { GlitchMode } from "postprocessing";

import { AsciiEffect } from "./AsciiEffect";
import { LensDistortion } from "./LensDistortion";

import useAsciiStore from "../../stores/asciiStore";

function Postprocessing() {
    const { fontAtlas, charSize, atlasGridSize, backgroundTexture, uiTexture } = useAsciiStore();

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

                {/* <Glitch
                    delay={new Vector2(3.5, 10)} // min and max glitch delay
                    duration={new Vector2(0.2, 0.3)} // min and max glitch duration
                    strength={new Vector2(0.02, 0.03)} // min and max glitch strength
                    chromaticAberrationOffset={new Vector2(0.5, 0.6)} // min and max chromatic aberration offset
                    mode={GlitchMode.SPORADIC} // glitch mode
                /> */}
                {/* <Bloom
                    luminanceThreshold={0.9}
                    luminanceSmoothing={2}
                    height={400}
                /> */}
                {/* <ChromaticAberration offset={[0.0002, 0.0002]} />
                <LensDistortion
                    distortion={new Vector2(0.01, 0.01)}
                    principalPoint={new Vector2(0, 0)}
                    focalLength={new Vector2(1, 1)}
                    skew={0}

                /> */}
                {/* <Noise opacity={0.15} /> */}
            </EffectComposer>
        </>
    );
}

export default Postprocessing;
