import { Center, useTexture } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import {
    Group,
    MathUtils,
    Mesh,
    MeshStandardMaterial,
    Plane,
    Raycaster,
    Vector2,
    Vector3,
} from "three";
import { FBXLoader } from "three/examples/jsm/Addons.js";

/** World-space offset after projecting the HTML section (tune placement vs layout) */
const CAT_ALIGN_OFFSET = new Vector3(-0.4, 0, -1);

/** Ray / plane intersection uses this world Z plane (same as your previous group origin) */
const CAT_ALIGN_PLANE_Z = 0;

function CatSection() {
    const { camera, gl } = useThree();

    const alignGroupRef = useRef<Group>(null);
    const raycaster = useMemo(() => new Raycaster(), []);
    const ndc = useRef(new Vector2());
    const hit = useRef(new Vector3());
    const alignPlane = useMemo(
        () => new Plane(new Vector3(0, 0, 1), -CAT_ALIGN_PLANE_Z),
        [],
    );


    // const sectionRef = useRef<any>(null);

    // ---- STARS ---- 
    // const starsRef = useRef<any>(null);
    // const starsArray = useRef<any[]>([]);
    // const starBaseScales = useRef<Vector3[]>([]);
    // const starScaledUp = useRef<Vector3[]>([]);
    // const starScaledDown = useRef<Vector3[]>([]);

    // ---- CAT ---- 
    const catRef = useRef<any>(null);
    const catTexture = useTexture("/models/cat/baked_cat.png");
    const catSourceModel = useLoader(FBXLoader, `/models/cat/cat.fbx`);
    const catModel = useMemo(() => catSourceModel.clone(true), [catSourceModel]);
    const catMaterial = useMemo(
        () =>
            new MeshStandardMaterial({
                map: catTexture,
            }),
        [catTexture],
    );

    const catMeshRef = useRef<Mesh | null>(null);

    // ANIMATION
    const isMouseOver = useRef(false);
    const animationProgress = useRef(0);
    const rotationSpeed = 14;
    const rotationAmount = useRef(0);

    useEffect(() => {
        if (!catModel) return;

        catModel.traverse((child) => {
            if (child instanceof Mesh) {
                child.material = catMaterial;
            }
        });

        catMeshRef.current = catModel.children[0] as Mesh;
    }, [catModel, catMaterial]);

    useEffect(() => {
        return () => {
            catMaterial.dispose();
        };
    }, [catMaterial]);

    // useEffect(() => {
    //     if (!starsRef.current) return;

    //     starsArray.current = starsRef.current.children[0].children[0].children;

    //     starBaseScales.current = [];
    //     starScaledUp.current = [];
    //     starScaledDown.current = [];
    // }, []);

    const syncCatToHtmlSection = () => {
        const group = alignGroupRef.current;
        if (!group || typeof document === "undefined") return;

        const el = document.getElementById("cat-section");
        if (!el) return;

        const canvas = gl.domElement;
        const canvasRect = canvas.getBoundingClientRect();
        const rect = el.getBoundingClientRect();

        const midX = rect.left + rect.width * 0.5 - canvasRect.left;
        const midY = rect.top + rect.height * 0.5 - canvasRect.top;

        if (canvasRect.width < 1 || canvasRect.height < 1) return;

        ndc.current.set(
            (midX / canvasRect.width) * 2 - 1,
            -(midY / canvasRect.height) * 2 + 1,
        );

        raycaster.setFromCamera(ndc.current, camera);
        if (raycaster.ray.intersectPlane(alignPlane, hit.current)) {
            group.position.copy(hit.current).add(CAT_ALIGN_OFFSET);
        }
    };

    useFrame((_state, delta) => {
        syncCatToHtmlSection();

        if (!catRef.current) return;

        // const elapsed = state.clock.elapsedTime;
        const target = isMouseOver.current ? 1 : 0;

        animationProgress.current = MathUtils.damp(
            animationProgress.current,
            target,
            target === 1 ? 20 : 5, // faster when moving, slower when freezing
            delta,
        );

        if (animationProgress.current < 0.01) {
            animationProgress.current = 0;
        }

        // Morph cat model back to original shape when not hovered
        if (target === 0 && animationProgress.current < 0.02) {
            if (catMeshRef.current?.morphTargetInfluences) {
                catMeshRef.current.morphTargetInfluences[0] = 0;
            }
        }

        updateRotation(delta);
        // updatePosition(elapsed);
        // updateStars();
    });

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

    // const updateStars = () => {
    //     const starBlinkingProgress = Math.sin(rotationAmount.current * 0.7);

    //     starsArray.current.forEach((star: any, index: number) => {
    //         // Initialize base scales if not set
    //         if (!starBaseScales.current[index]) {
    //             const baseScale = star.scale.clone();
    //             starBaseScales.current[index] = baseScale;

    //             starScaledUp.current[index] = baseScale
    //                 .clone()
    //                 .multiplyScalar(1.3);
    //             starScaledDown.current[index] = baseScale
    //                 .clone()
    //                 .multiplyScalar(0.8);
    //         }

    //         // Blink stars's scale when mouse is over the cat
    //         if (isMouseOver.current) {
    //             const targetScale =
    //                 starBlinkingProgress > 0
    //                     ? starScaledUp.current[index]
    //                     : starScaledDown.current[index];

    //             star.scale.lerp(targetScale, 0.1 * animationProgress.current);
    //         } else {
    //             // Scale stars back to original size when not hovering cat
    //             star.scale.lerp(
    //                 starBaseScales.current[index],
    //                 0.1 * (1 - animationProgress.current),
    //             );
    //         }
    //     });
    // };

    const onMouseEnter = () => {
        isMouseOver.current = true;
        // mouseEnter();

        // Set shape key influence to 1 (retracted legs)
        if (catMeshRef.current?.morphTargetInfluences) {
            catMeshRef.current.morphTargetInfluences[0] = 1;
        }
    };

    const onMouseLeave = () => {
        isMouseOver.current = false;
        // mouseLeave();
    };

    return (
        <>
            <group ref={alignGroupRef} position={[-1000,0,0]}>
                <Center>
                    <primitive
                        scale={0.1}
                        ref={catRef}
                        object={catModel}
                        onPointerOver={onMouseEnter}
                        onPointerOut={onMouseLeave}
                    />
                </Center>
            </group>
            <pointLight
                position={[-5, 8, 8]}
                intensity={3}
                color={"white"}
                decay={0.02}
            />
            {/* <group scale={2} ref={sectionRef} position={[-99, 0, -99]}>
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
            </group> */}
        </>
    );
}

export default CatSection;
