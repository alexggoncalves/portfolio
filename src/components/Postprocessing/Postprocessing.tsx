import {
    Bloom,
    ChromaticAberration,
    EffectComposer,
    Glitch,
    Scanline,
} from "@react-three/postprocessing";
import { Vector2 } from "three";

import { AsciiEffect } from "./AsciiEffect";
import { LensDistortion } from "./LensDistortion";

function Postprocessing() {
    return (
        <>
            <EffectComposer>
                <AsciiEffect></AsciiEffect>

                {/* <Glitch
                delay={new Vector2(3.5, 10)} // min and max glitch delay
                duration={new Vector2(0.2, 0.3)} // min and max glitch duration
                strength={new Vector2(0.02, 0.03)} // min and max glitch strength
                chromaticAberrationOffset={new Vector2(0.5, 0.60)} // min and max chromatic aberration offset
                // mode={GlitchMode.SPORADIC} // glitch mode
                /> */}
                {/* <Bloom
                    luminanceThreshold={0.3}
                    luminanceSmoothing={2}
                    height={1000}
                /> */}
                {/* <Scanline density={5} /> */}
                <ChromaticAberration offset={[0,0]} />
                <LensDistortion
                    distortion={new Vector2(0.05, 0.05)}
                    principalPoint={new Vector2(0, 0)}
                    focalLength={new Vector2(1, 1)}
                    skew={0}
                />
            </EffectComposer>
        </>
    );
}

export default Postprocessing;
