import { Center, Image, useTexture } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import getWorldPosition from "../../utils/getWorldPosition";
import { MathUtils, Mesh, MeshStandardMaterial, Vector3 } from "three";
import { getObjectSize } from "../../utils/getWorldScale";
import { FBXLoader } from "three/examples/jsm/Addons.js";
import useCursorStore from "../../stores/pointerStore";
import { RenderConfig } from "../render/RenderConfig";
import { AppState } from "../render/AppState";

function CatSection() {
    const { camera, size } = useThree();
    const { mouseEnter, mouseLeave } = useCursorStore();

    const sectionRef = useRef<any>(null);

    const pageCoords = {
        x: RenderConfig.gridSize.x / 2,
        y: RenderConfig.gridSize.y * 1.85,
    };

    // STARS
    const starsRef = useRef<any>(null);
    const starsArray = useRef<any[]>([]);
    const starBaseScales = useRef<Vector3[]>([]);
    const starScaledUp = useRef<Vector3[]>([]);
    const starScaledDown = useRef<Vector3[]>([]);

    // CAT
    const catRef = useRef<any>(null);
    const catTexture = useTexture("/models/cat/baked_cat.png");
    const catModel = useLoader(FBXLoader, `/models/cat/cat.fbx`);
    const baseSize = useRef<Vector3 | null>(null);
    const catMeshRef = useRef<Mesh | null>(null);

    // ANIMATION
    const isMouseOver = useRef(false);
    const animationProgress = useRef(0);
    const rotationSpeed = 14;
    const rotationAmount = useRef(0);

    // Set material once the model is loaded
    useEffect(() => {
        catModel.traverse((child) => {
            if (child instanceof Mesh) {
                // Cleanup original materials
                if (Array.isArray(child.material)) {
                    child.material.forEach((m) => m.dispose());
                } else {
                    child.material.dispose();
                }

                // Set material with baked texture
                child.material = new MeshStandardMaterial({
                    map: catTexture,
                });
            }
        });
        catMeshRef.current = catModel.children[0] as Mesh;
    }, [catModel, catTexture]);

    // Store references to star meshes
    useEffect(() => {
        starsArray.current = starsRef.current.children[0].children[0].children;
    }, []);

    // Get original size of the cat model once
    useEffect(() => {
        if (!baseSize.current && catRef.current) {
            baseSize.current = getObjectSize(catRef.current);
        }
    }, []);

    useFrame((state, delta) => {
        if (
            !catRef.current ||
            !sectionRef.current ||
            !starsRef.current ||
            !baseSize.current
        )
            return;

        const elapsed = state.clock.elapsedTime;
        const target = isMouseOver.current ? 1 : 0;

        animationProgress.current = MathUtils.damp(
            animationProgress.current,
            target,
            target === 1 ? 20 : 5, // faster when moving, slower when freezing
            delta,
        );

        if (animationProgress.current < 0.01) {
            // snap to 0 when very close to prevent tiny unwanted movements
            animationProgress.current = 0;
        }

        // Morph cat model back to original shape when not hovered
        if (target === 0 && animationProgress.current < 0.02) {
            if (catMeshRef.current?.morphTargetInfluences) {
                catMeshRef.current.morphTargetInfluences[0] = 0;
            }
        }

        updateRotation(delta);
        updatePosition(elapsed);
        updateStars();
    });

    const updatePosition = (elapsed: number) => {
        let homeScrollOffset = Math.round(AppState.pageScrolls["home"])
        if(!homeScrollOffset) homeScrollOffset = 0;

        // Get world position for the page coords
        const sectionWorldPos = getWorldPosition(
            { x: pageCoords.x, y: pageCoords.y - homeScrollOffset },
            5,
            camera,
            size,
            "grid",
            RenderConfig.gridSize,
        );

        // Base Cat position
        sectionRef.current.position.copy(sectionWorldPos);

        // Add vertical bobbing when hovered
        const offsetY = Math.sin(elapsed * 6) * 0.1;
        catRef.current.position.y = offsetY * animationProgress.current;
    };

    const updateRotation = (delta: number) => {
        // target rotation speed when fully hovered

        if (isMouseOver.current) {
            // spin while hovering
            rotationAmount.current +=
                rotationSpeed * delta * animationProgress.current;
        } else {
            // calculate the next multiple of 2π compared to original rotation
            const nextRotation =
                Math.ceil(rotationAmount.current / (2 * Math.PI)) * 2 * Math.PI;

            // lerp toward the original rotation
            rotationAmount.current = MathUtils.damp(
                rotationAmount.current,
                nextRotation,
                5, // same damping as bobbing
                delta,
            );
        }

        // apply rotation
        catRef.current.rotation.y = rotationAmount.current;

        // sectionRef.current.children[0].lookAt(camera.position); // Maybe for the mobile version?
    };

    const updateStars = () => {
        const starBlinkingProgress = Math.sin(rotationAmount.current * 0.7);

        starsArray.current.forEach((star: any, index: number) => {
            // Initialize base scales if not set
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

            // Blink stars's scale when mouse is over the cat
            if (isMouseOver.current) {
                const targetScale =
                    starBlinkingProgress > 0
                        ? starScaledUp.current[index]
                        : starScaledDown.current[index];

                star.scale.lerp(targetScale, 0.1 * animationProgress.current);
            } else {
                // Scale stars back to original size when not hovering cat
                star.scale.lerp(
                    starBaseScales.current[index],
                    0.1 * (1 - animationProgress.current),
                );
            }
        });
    };

    const onMouseEnter = () => {
        isMouseOver.current = true;
        mouseEnter();

        // Set shape key influence to 1 (retracted legs)
        if (catMeshRef.current?.morphTargetInfluences) {
            catMeshRef.current.morphTargetInfluences[0] = 1;
        }
    };

    const onMouseLeave = () => {
        isMouseOver.current = false;
        mouseLeave();
    };

    return (
        <>
            <group ref={sectionRef}>
                {/* Cat */}
                <Center position={[-0.15, -0.1, 0]}>
                    <primitive
                        scale={0.044}
                        ref={catRef}
                        object={catModel}
                        onPointerOver={onMouseEnter}
                        onPointerOut={onMouseLeave}
                    ></primitive>
                    <pointLight
                        position={[-4, 7, 0]}
                        intensity={3}
                        color={"white"}
                        decay={0.02}
                    />
                </Center>

                {/* Stars */}
                <Center ref={starsRef} position={[0, 0, 0]}>
                    {/* LEFT */}
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

                    {/* RIGHT */}

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
        </>
    );
}

export default CatSection;
