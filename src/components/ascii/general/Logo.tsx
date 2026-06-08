import {
    Circle,
    GradientTexture,
    GradientType,
    useTexture,
} from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
    Group,
    MultiplyBlending,
    NearestFilter,
    SRGBColorSpace,
    Vector3,
} from "three";
import useAsciiRenderStore from "../../../stores/asciiRenderStore";
import { damp } from "three/src/math/MathUtils.js";
import { useNavigate } from "react-router";

function Logo() {
    const { viewport } = useThree();
    const navigate = useNavigate();

    const gradientRef = useRef<Group>(null);
    const target = useRef(new Vector3());
    const isHovering = useRef(false);
    const scale = useRef(0);

    const texture = useTexture("/images/LOGO_ascii_map.webp");

    const viewCellSize = useAsciiRenderStore((s) => s.viewCellSize);
    const extraColumns = useAsciiRenderStore((s) => s.extraColumns);
    const extraRows = useAsciiRenderStore((s) => s.extraRows);

    useEffect(() => {
        texture.minFilter = NearestFilter;
        texture.magFilter = NearestFilter;
        texture.generateMipmaps = false;
        texture.colorSpace = SRGBColorSpace;
    }, [texture]);

    // Logo size in world units
    const blockSize = useMemo(() => {
        const imgW = 30; // cells
        const imgH = 7; // cells

        return {
            w: imgW * viewCellSize.w,
            h: imgH * viewCellSize.h,
        };
    }, [viewCellSize]);

    // top-left of screen in world units
    const topLeft = useMemo(() => {
        return {
            x: -viewport.width / 2,
            y: viewport.height / 2,
        };
    }, [viewport.width, viewport.height]);

    // Align to top left
    const position: [number, number, number] = [
        topLeft.x + (extraColumns + 1) * viewCellSize.w + blockSize.w / 2,

        topLeft.y - extraRows * viewCellSize.h - blockSize.h / 2,

        0,
    ];

    useFrame((state, delta) => {
        const x = state.pointer.x;
        const y = state.pointer.y;

        target.current.set(
            x * viewport.width * 0.5,
            y * viewport.height * 0.5,
            0,
        );

        if (gradientRef.current) {
            gradientRef.current.position.lerp(target.current, 0.2);

            // smooth scale in/out
            const targetScale = isHovering.current ? 1 : 0;

            scale.current = damp(scale.current, targetScale, 6, delta);

            gradientRef.current.scale.setScalar(scale.current);
        }
    });
    return (
        <>
            <group ref={gradientRef}>
                <Circle renderOrder={1000} scale={0.7}>
                    <meshBasicMaterial
                        blending={MultiplyBlending}
                        transparent
                        opacity={1}
                        depthTest={false}
                        depthWrite={false}
                        premultipliedAlpha
                    >
                        <GradientTexture
                            premultiplyAlpha
                            stops={[0, 0.6, 0.8, 1]}
                            colors={[
                                "#f356ac",
                                "#ffe0f4",
                                "#fff7fc",
                                "white"
                            ]}
                            size={512} 
                            width={512}
                            type={GradientType.Radial}
                            innerCircleRadius={0} 
                            outerCircleRadius={"auto"}
                        />
                    </meshBasicMaterial>
                </Circle>
            </group>

            <mesh
                position={position}
                renderOrder={999}
                onPointerEnter={() => {
                    isHovering.current = true;
                    document.body.style.cursor = "pointer";
                }}
                onPointerLeave={() => {
                    isHovering.current = false;
                    document.body.style.cursor = "default";
                }}
                onClick={() => {
                    navigate("/");
                }}
            >
                <planeGeometry args={[blockSize.w, blockSize.h]} />
                <meshBasicMaterial
                    transparent
                    map={texture}
                    depthTest={false}
                    depthWrite={false}
                />
            </mesh>
        </>
    );
}

export default Logo;
