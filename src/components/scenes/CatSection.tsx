import { Center, Image, useTexture } from "@react-three/drei";
import { useEffect, useRef } from "react";
import useAsciiStore from "../../stores/asciiStore";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import getWorldPosition from "../../utils/getWorldPosition";
import { MathUtils, Mesh, MeshStandardMaterial, Vector3 } from "three";
import { getObjectSize } from "../../utils/getWorldScale";
import useSceneStore from "../../stores/sceneStore";
import { FBXLoader } from "three/examples/jsm/Addons.js";
import useCursorStore from "../../stores/pointerStore";

function CatSection() {
    const { camera, size } = useThree();
    const { gridSize } = useAsciiStore();
    const { mouseEnter, mouseLeave } = useCursorStore();
    const sectionRef = useRef<any>(null);

    const pageCoords = {
        x: gridSize.x / 2,
        y: gridSize.y * 1.85,
    };

    // STARS
    const starsRef = useRef<any>(null);
    const starBaseScales = useRef<Vector3[]>([]);

    // CAT
    const catRef = useRef<any>(null);
    const catTexture = useTexture("/models/cat/baked_cat.png");
    const catModel = useLoader(FBXLoader, `/models/cat/cat.fbx`);
    const baseSize = useRef<Vector3 | null>(null);
    // const baseY = useRef<number | null>(null);

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
    }, [catModel, catTexture]);

    const updatePosition = (elapsed: number) => {
        let homeScrollOffset = Math.round(
            useSceneStore.getState().pageScrolls["home"],
        );

        // console.log(homeScrollOffset);
        const coords = {
            x: pageCoords.x, // center the cat on the X axis
            y: pageCoords.y - homeScrollOffset,
        };

        // Get world position for the page coords
        const worldPos = getWorldPosition(
            coords,
            5,
            camera,
            size,
            "grid",
            gridSize,
        );

        // Base position
        sectionRef.current.position.copy(worldPos);

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
    };

    useFrame((state, delta) => {
        if (!catRef.current || !sectionRef.current || !starsRef.current) return;

        // Get original object size once
        if (!baseSize.current) {
            const size = getObjectSize(catRef.current);
            if (size.x === 0 || size.y === 0) return;
            baseSize.current = size;
        }

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

        if (target === 0 && animationProgress.current < 0.02) {
            if (catModel.children[0] instanceof Mesh) {
                if (catModel.children[0].morphTargetInfluences)
                    catModel.children[0].morphTargetInfluences[0] = 0;
            }
        }
        // sectionRef.current.children[0].lookAt(camera.position);
        updateRotation(delta);
        updatePosition(elapsed);
        updateStars();
    });

    const updateStars = () => {
        const stars = starsRef.current.children[0].children[0].children;

        stars.forEach((star: any, index: number) => {
            // Initialize base scales if not set
            if (!starBaseScales.current[index]) {
                starBaseScales.current[index] = star.scale.clone();
            }

            const starBlinkingProgress = Math.sin(rotationAmount.current * 0.7);

            // Blink stars's scale when mouse is over the cat
            if (isMouseOver.current) {
                star.scale.lerp(
                    starBlinkingProgress > 0
                        ? starBaseScales.current[index]
                              .clone()
                              .multiplyScalar(1.3)
                        : starBaseScales.current[index]
                              .clone()
                              .multiplyScalar(0.8),
                    0.1 * animationProgress.current,
                );
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
        if (catModel.children[0] instanceof Mesh) {
            if (catModel.children[0].morphTargetInfluences)
                catModel.children[0].morphTargetInfluences[0] = 1;
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
                        position={[-5, 8, 0]}
                        intensity={34}
                        color={"white"}
                        decay={1.14}
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
