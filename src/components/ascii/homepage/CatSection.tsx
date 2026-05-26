import { Center, useTexture } from "@react-three/drei";
import { useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from "react";
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
import CatSectionStars from "./CatSectionStars";

import { NORMAL_ASCII_LAYER, setRenderLayer } from "../asciiLayers";

const CAT_ALIGN_OFFSET = new Vector3(-0.6, 0, -1);

function CatSection({ opacity }: { opacity: RefObject<number> }) {
    const { camera, gl } = useThree();

    const alignGroupRef = useRef<Group>(null);
    const raycaster = useMemo(() => new Raycaster(), []);
    const ndc = useRef(new Vector2());
    const hit = useRef(new Vector3());
    const alignPlane = useMemo(
        () => new Plane(new Vector3(0, 0, 1), 0),
        [],
    );

    // ---- CAT ----
    const catRef = useRef<any>(null);
    const catTexture = useTexture("/models/cat/baked_cat.png");
    const catSourceModel = useLoader(FBXLoader, `/models/cat/cat.fbx`);
    const catModel = useMemo(
        () => catSourceModel.clone(true),
        [catSourceModel],
    );
    const catMaterial = useMemo(
        () =>
            new MeshStandardMaterial({
                map: catTexture,
                transparent: true,
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


    useLayoutEffect(() => {
        const apply = () =>
            setRenderLayer(alignGroupRef.current, NORMAL_ASCII_LAYER);
        apply();
        const id = requestAnimationFrame(apply);
        return () => cancelAnimationFrame(id);
    }, [catModel]);

    const syncCatToHtmlSection = () => {
        const group = alignGroupRef.current;
        if (!group || typeof document === "undefined") return;

        const el = document.getElementById("cat-section");

        if (!el) {
            group.position.set(-1000, 0, 0);
            return;
        }

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

        if (catMaterial) {
            catMaterial.opacity = opacity.current;
        }

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
    };

    const onMouseEnter = () => {
        isMouseOver.current = true;

        // Set shape key influence to 1 (retracted legs)
        if (catMeshRef.current?.morphTargetInfluences) {
            catMeshRef.current.morphTargetInfluences[0] = 1;
        }
    };

    const onMouseLeave = () => {
        isMouseOver.current = false;
    };

    return (
        <>
            <group ref={alignGroupRef} position={[-1000, 0, 0]}>
                <Center>
                    <primitive
                        scale={0.1}
                        ref={catRef}
                        object={catModel}
                        onPointerOver={onMouseEnter}
                        onPointerOut={onMouseLeave}
                    />
                </Center>
                <pointLight
                    position={[-5, 8, 8]}
                    intensity={3}
                    color={"white"}
                    decay={0.02}
                />

                <CatSectionStars
                    isMouseOver={isMouseOver}
                    animationProgress={animationProgress}
                    rotationAmount={rotationAmount}
                    opacity={opacity}
                />
            </group>
        </>
    );
}

export default CatSection;
