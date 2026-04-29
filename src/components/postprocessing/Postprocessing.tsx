import {
    ChromaticAberration,
    EffectComposer,
    // Glitch,
    // Vignette,
} from "@react-three/postprocessing";
// import { GlitchMode } from "postprocessing";
import { AsciiEffect } from "./AsciiEffect";
import { LensDistortion } from "./LensDistortion";
import { CanvasTexture, Vector2 } from "three";

import { useMemo } from "react";
import { AsciiRenderConfig } from "../app/AsciiRenderConfig";

function Postprocessing({
    asciiRenderTarget,
    backgroundRenderTarget,
}: {
    asciiRenderTarget: React.RefObject<{
        texture: CanvasTexture | null;
        context: CanvasRenderingContext2D | null;
    }>;
    backgroundRenderTarget: React.RefObject<{
        texture: CanvasTexture | null;
        context: CanvasRenderingContext2D | null;
    }>;
}) {
    const principalPoint = useMemo(() => new Vector2(0, 0), []);

    return (
        <>
            <EffectComposer>
                <AsciiEffect
                    fontAtlasSrc={AsciiRenderConfig.fontAtlas}
                    charSize={AsciiRenderConfig.charSize}
                    atlasGridSize={AsciiRenderConfig.atlasGridSize}
                    gridSize={AsciiRenderConfig.gridSize}
                    asciiRenderTarget={asciiRenderTarget}
                    backgroundRenderTarget={backgroundRenderTarget}
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
