import { forwardRef, useMemo } from "react";
import { Vector2 } from "three";
import { LensDistortionEffect } from "postprocessing";

type LensDistortionProps = {
    distortion: Vector2;
    principalPoint: Vector2;
    focalLength: Vector2;
    skew: 0;
};

export const LensDistortion = forwardRef(
    (
        { distortion, principalPoint, focalLength, skew }: LensDistortionProps,
        ref
    ) => {
        const effect = useMemo(
            () =>
                new LensDistortionEffect({
                    distortion,
                    principalPoint,
                    focalLength,
                    skew,
                }),
            [distortion, principalPoint, focalLength, skew]
        );
        return <primitive ref={ref} object={effect} dispose={null} />;
    }
);
