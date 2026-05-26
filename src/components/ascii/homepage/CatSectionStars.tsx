import { Center, Image } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
    useLayoutEffect,
    useRef,
    type MutableRefObject,
    type RefObject,
} from "react";
import { Group, Material, Mesh, Object3D, Vector3 } from "three";
import { NORMAL_ASCII_LAYER, setRenderLayer } from "../asciiLayers";

export type CatSectionStarsProps = {
    isMouseOver: MutableRefObject<boolean>;
    animationProgress: MutableRefObject<number>;
    rotationAmount: MutableRefObject<number>;
    opacity: RefObject<number>;
    /** Outer group scale (default matches previous CatSection layout) */
    scale?: number;
    /** Outer group position relative to the cat align group */
    position?: [number, number, number];
};

function collectStarMeshes(root: Group | null): Object3D[] {
    if (!root) return [];
    const first = root.children[0] as Group | undefined;
    const second = first?.children[0] as Group | undefined;
    const leaves = second?.children;
    if (!leaves?.length) return [];
    return leaves.filter((c): c is Object3D => c instanceof Object3D);
}

function CatSectionStars({
    isMouseOver,
    animationProgress,
    rotationAmount,
    opacity,
    scale = 2,
    position = [0, 0.45, 0],
}: CatSectionStarsProps) {
    const outerGroupRef = useRef<Group>(null);
    const starsRef = useRef<Group | null>(null);
    const starsArray = useRef<Object3D[]>([]);
    const starBaseScales = useRef<Vector3[]>([]);
    const starScaledUp = useRef<Vector3[]>([]);
    const starScaledDown = useRef<Vector3[]>([]);

    useLayoutEffect(() => {
        const applyLayers = () =>
            setRenderLayer(outerGroupRef.current, NORMAL_ASCII_LAYER);

        const tryHydrate = () => {
            const meshes = collectStarMeshes(starsRef.current);
            if (meshes.length === 0) return false;
            starsArray.current = meshes;
            starBaseScales.current = [];
            starScaledUp.current = [];
            starScaledDown.current = [];
            return true;
        };

        const tick = () => {
            tryHydrate();
            applyLayers();
        };

        tick();
        const id = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(id);
    }, []);

    useFrame(() => {
        const a = opacity.current;

        starsArray.current.forEach((star) => {
            star.traverse((node) => {
                if (!(node instanceof Mesh)) return;
                const materials = Array.isArray(node.material)
                    ? node.material
                    : [node.material];
                for (const mat of materials) {
                    if (!mat || !("opacity" in mat)) continue;
                    const m = mat as Material & { transparent?: boolean };
                    m.transparent = true;
                    m.opacity = a;
                }
            });
        });

        const starBlinkingProgress = Math.sin(rotationAmount.current * 0.7);

        starsArray.current.forEach((star, index) => {
            if (!starBaseScales.current[index]) {
                const baseScale = star.scale.clone();
                starBaseScales.current[index] = baseScale;
                starScaledUp.current[index] = baseScale
                    .clone()
                    .multiplyScalar(1.3);
                starScaledDown.current[index] = baseScale
                    .clone()
                    .multiplyScalar(0.8);
            }

            if (isMouseOver.current) {
                const targetScale =
                    starBlinkingProgress > 0
                        ? starScaledUp.current[index]
                        : starScaledDown.current[index];
                star.scale.lerp(targetScale, 0.1 * animationProgress.current);
            } else {
                star.scale.lerp(
                    starBaseScales.current[index],
                    0.1 * (1 - animationProgress.current),
                );
            }
        });
    });

    return (
        <group ref={outerGroupRef} scale={scale} position={position}>
            <Center ref={starsRef} position={[0, 0, 0]}>
                <Image
                    scale={[0.5, 0.5]}
                    transparent
                    url="/images/stars/star2.png"
                    position={[-1.85, 0.51, 0]}
                />

                <Image
                    scale={[0.8, 0.8]}
                    transparent
                    url="/images/stars/star1.png"
                    position={[-2.32, -0.2, 0]}
                />

                <Image
                    scale={[0.3, 0.5]}
                    transparent
                    url="/images/stars/star3.png"
                    position={[-2.7, 0.71, 0]}
                />

                <Image
                    scale={[0.4, 0.6]}
                    transparent
                    url="/images/stars/star2.png"
                    position={[-3.2, 0.24, 0]}
                />

                <Image
                    scale={[0.5, 0.5]}
                    transparent
                    url="/images/stars/star1.png"
                    position={[-3.8, -0.2, 0]}
                />

                <Image
                    scale={[0.6, 0.6]}
                    transparent
                    url="/images/stars/star1.png"
                    position={[-4, 0.6, 0]}
                />

                <Image
                    scale={[0.3, 0.5]}
                    transparent
                    url="/images/stars/star2.png"
                    position={[0.89, -0.33, 0]}
                />

                <Image
                    scale={[0.7, 0.7]}
                    transparent
                    url="/images/stars/star1.png"
                    position={[1, 0.54, 0]}
                />

                <Image
                    scale={[0.4, 0.6]}
                    transparent
                    url="/images/stars/star3.png"
                    position={[1.7, -0.1, 0]}
                />

                <Image
                    scale={[0.4, 0.8]}
                    transparent
                    url="/images/stars/star2.png"
                    position={[2.07, 0.6, 0]}
                />

                <Image
                    scale={[0.9, 0.9]}
                    transparent
                    url="/images/stars/star1.png"
                    position={[2.8, -0.2, 0]}
                />

                <Image
                    scale={[0.4, 0.4]}
                    transparent
                    url="/images/stars/star1.png"
                    position={[3.1, 0.6, 0]}
                />
            </Center>
        </group>
    );
}

export default CatSectionStars;
