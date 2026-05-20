import { LensDistortion } from "./LensDistortion";
import { Vector2 } from "three";

import { EffectComposer } from "@react-three/postprocessing";

import { useMemo } from "react";
import useAsciiRenderStore from "../../stores/asciiRenderStore";

function Postprocessing() {
    const distortion = useAsciiRenderStore((state) => state.distortion);
    const focalLength = useAsciiRenderStore((state) => state.focalLength);

    const principalPoint = useMemo(() => new Vector2(0, 0), []);
    const distortionVec = useMemo(
        () => new Vector2(distortion.x, distortion.y),
        [distortion],
    );
    const focalLengthVec = useMemo(
        () => new Vector2(focalLength.x, focalLength.y),
        [focalLength],
    );

    return (
        <>
            <EffectComposer>
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
