import { Image } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import { Group, Material, Mesh, Object3D, Vector3 } from "three";
import { NORMAL_ASCII_LAYER, setRenderLayer } from "../asciiLayers";
import useSceneStore from "../../../stores/sceneStore";

export type CatSectionStarsProps = {
    /** True while stars should use the sin-based twinkle (desktop hover or mobile spin). */
    twinkleActive: RefObject<boolean>;
    animationProgress: RefObject<number>;
    rotationAmount: RefObject<number>;
    opacity: RefObject<number>;
    scale?: number;
    position?: [number, number, number];
};

type StarDef = {
    x: number;
    y: number;
    scale: number;
    url: string;
};

const STAR_LAYOUT: StarDef[] = [
    // LEFT
    { x: -0.83, y: 0.2, scale: 2, url: "/images/stars/star2.png" },
    { x: -0.67, y: -0.2, scale: 1.6, url: "/images/stars/star3.png" },
    { x: -0.5, y: 0.3, scale: 1.2, url: "/images/stars/star1.png" },
    { x: -0.4, y: -0.1, scale: 1.2, url: "/images/stars/star2.png" },

    // RIGHT
    { x: 0.53, y: 0.23, scale: 1.8, url: "/images/stars/star2.png" },
    { x: 0.66, y: -0.19, scale: 1.4, url: "/images/stars/star1.png" },
    { x: 0.86, y: 0.25, scale: 1.4, url: "/images/stars/star3.png" },
    { x: 0.98, y: -0.12, scale: 1.3, url: "/images/stars/star2.png" },
];

const STAR_LAYOUT_MOBILE: StarDef[] = [
    { x: -0.05, y: 0.7, scale: 1, url: "/images/stars/star2.png" },
    { x: -0.6, y: 0.5, scale: 1.8, url: "/images/stars/star1.png" },
    { x: -0.4, y: -0.6, scale: 1.3, url: "/images/stars/star3.png" },
    { x: -0.7, y: -0.1, scale: 1.2, url: "/images/stars/star2.png" },
    { x: 0.9, y: 0.23, scale: 1.4, url: "/images/stars/star2.png" },
    { x: 0.86, y: -0.3, scale: 1.4, url: "/images/stars/star1.png" },
    { x: 0.6, y: 0.67, scale: 1.2, url: "/images/stars/star3.png" },
    { x: 0.4, y: -0.7, scale: 1.3, url: "/images/stars/star2.png" },
];

function CatSectionStars({
    twinkleActive,
    animationProgress,
    rotationAmount,
    opacity,
    scale = 1,
}: CatSectionStarsProps) {
    const { viewport } = useThree();
    const isMobile = useSceneStore((s) => s.isMobile);

    const starsRef = useRef<Group | null>(null);

    const starsArray = useRef<Object3D[]>([]);
    const baseScales = useRef<Vector3[]>([]);
    const upScales = useRef<Vector3[]>([]);
    const downScales = useRef<Vector3[]>([]);

    const worldLayout = useMemo(() => {
        // convert normalized layout → viewport space
        const w = viewport.width * 0.5;
        const h = viewport.height * 0.5;

        const layout = isMobile ? STAR_LAYOUT_MOBILE : STAR_LAYOUT;

        return layout.map((s) => ({
            ...s,
            worldPos: [s.x * w, s.y * h, 0] as [number, number, number],
        }));
    }, [viewport.width, viewport.height]);

    useLayoutEffect(() => {
        setRenderLayer(starsRef.current, NORMAL_ASCII_LAYER);

        const root = starsRef.current;
        if (!root) return;

        const meshes: Object3D[] = [];
        root.traverse((obj) => {
            if (obj instanceof Mesh) meshes.push(obj);
        });

        starsArray.current = meshes;
    }, []);

    useFrame(() => {
        const a = opacity.current;

        const blink = Math.sin(rotationAmount.current * 0.7);

        starsArray.current.forEach((star, i) => {
            // opacity
            star.traverse((node) => {
                if (!(node instanceof Mesh)) return;

                const mats = Array.isArray(node.material)
                    ? node.material
                    : [node.material];

                for (const mat of mats) {
                    const m = mat as Material & { transparent?: boolean };
                    m.transparent = true;
                    m.opacity = a;
                }
            });

            // scale init
            if (!baseScales.current[i]) {
                const base = star.scale.clone();
                baseScales.current[i] = base;
                upScales.current[i] = base.clone().multiplyScalar(1.3);
                downScales.current[i] = base.clone().multiplyScalar(0.8);
            }

            if (twinkleActive.current) {
                const target =
                    blink > 0 ? upScales.current[i] : downScales.current[i];

                star.scale.lerp(target, 0.1 * animationProgress.current);
            } else {
                star.scale.lerp(
                    baseScales.current[i],
                    0.1 * (1 - animationProgress.current),
                );
            }
        });
    });

    return (
        <group ref={starsRef} scale={scale} position={[0, 0, 0]}>
            {worldLayout.map((s, i) => (
                <Image
                    key={i}
                    scale={[s.scale, s.scale]}
                    transparent
                    url={s.url}
                    position={s.worldPos}
                />
            ))}
        </group>
    );
}

export default CatSectionStars;
