import { useTexture } from "@react-three/drei";
import {
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    type RefObject,
} from "react";
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

import { NORMAL_ASCII_LAYER, setRenderLayer } from "../general/asciiLayers";
import useSceneStore from "../../../stores/sceneStore";

const CAT_ALIGN_OFFSET = new Vector3(-0.6, 0, -1);
const CAT_ALIGN_OFFSET_MOBILE = new Vector3(-0.32, 0, -1);

function CatSection({ opacity }: { opacity: RefObject<number> }) {
    const { camera, gl } = useThree();
    const isMobile = useSceneStore((s) => s.isMobile);
    const isTouch = useSceneStore((s) => s.isTouch);

    const alignGroupRef = useRef<Group>(null);

    const catRef = useRef<any>(null);
    const catMeshRef = useRef<Mesh | null>(null);

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

    // -----------------------
    // DESKTOP
    // -----------------------
    const isMouseOver = useRef(false);
    const starsTwinkleActive = useRef(false);
    const animationProgress = useRef(0);
    const rotationSpeed = 14;

    // -----------------------
    // MOBILE PHYSICS
    // -----------------------
    const rotationAmount = useRef(0);
    const spinVelocity = useRef(0);

    const REST_STEP = Math.PI * 2;

    // APPLY MATERIAL
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

        const ndc = new Vector2(
            (midX / canvasRect.width) * 2 - 1,
            -(midY / canvasRect.height) * 2 + 1,
        );

        const raycaster = new Raycaster();
        const plane = new Plane(new Vector3(0, 0, 1), 0);
        const hit = new Vector3();

        raycaster.setFromCamera(ndc, camera);

        if (raycaster.ray.intersectPlane(plane, hit)) {
            if (isMobile) {
                group.position.copy(hit).add(CAT_ALIGN_OFFSET_MOBILE);
            } else {
                group.position.copy(hit).add(CAT_ALIGN_OFFSET);
            }
        }
    };

    // TOUCH CLICK
    const onClick = () => {
        if (!isTouch) return;

        spinVelocity.current += Math.PI * 2.5;

        if (catMeshRef.current?.morphTargetInfluences) {
            catMeshRef.current.morphTargetInfluences[0] = 1;
        }
    };

    // DESKTOP HOVER
    const onPointerEnter = () => {
        if (isTouch) return;
        isMouseOver.current = true;

        document.body.style.cursor = "crosshair";

        if (catMeshRef.current?.morphTargetInfluences) {
            catMeshRef.current.morphTargetInfluences[0] = 1;
        }
    };

    const onPointerLeave = () => {
        if (isTouch) return;
        isMouseOver.current = false;
        document.body.style.cursor = "default";
    };

    useFrame((_state, delta) => {
        syncCatToHtmlSection();

        if (!catRef.current) return;

        if (catMaterial) {
            catMaterial.opacity = opacity.current;
        }

        // TOUCH SCREEN BEHAVIOUR
        if (isTouch) {
            rotationAmount.current += spinVelocity.current * delta * 2;

            spinVelocity.current = MathUtils.damp(
                spinVelocity.current,
                0,
                3,
                delta,
            );

            const moving = Math.abs(spinVelocity.current) > 0.05;
            starsTwinkleActive.current = moving;

            animationProgress.current = MathUtils.damp(
                animationProgress.current,
                moving ? 1 : 0,
                6,
                delta,
            );

            if (catMeshRef.current?.morphTargetInfluences) {
                catMeshRef.current.morphTargetInfluences[0] = moving ? 1 : 0;
            }

            const target =
                Math.round(rotationAmount.current / REST_STEP) * REST_STEP;

            const attractionStrength = moving ? 2 : 6;

            rotationAmount.current = MathUtils.damp(
                rotationAmount.current,
                target,
                attractionStrength,
                delta,
            );
        }
        // DESKTOP BEHAVIOUR
        else {
            starsTwinkleActive.current = isMouseOver.current;

            const target = isMouseOver.current ? 1 : 0;

            animationProgress.current = MathUtils.damp(
                animationProgress.current,
                target,
                target === 1 ? 20 : 5,
                delta,
            );

            if (animationProgress.current < 0.01) {
                animationProgress.current = 0;
            }

            if (
                target === 0 &&
                animationProgress.current < 0.02 &&
                catMeshRef.current?.morphTargetInfluences
            ) {
                catMeshRef.current.morphTargetInfluences[0] = 0;
            }

            if (isMouseOver.current) {
                rotationAmount.current +=
                    rotationSpeed * delta * animationProgress.current;
            } else {
                const nextRotation =
                    Math.ceil(rotationAmount.current / REST_STEP) * REST_STEP;

                rotationAmount.current = MathUtils.damp(
                    rotationAmount.current,
                    nextRotation,
                    5,
                    delta,
                );
            }
        }

        catRef.current.rotation.y = rotationAmount.current;
    });

    return (
        <group ref={alignGroupRef} position={[-1000, 0, 0]}>
            <primitive
                position={[0, -1.6, 0]}
                ref={catRef}
                object={catModel}
                scale={isMobile ? 0.08 : 0.1}
                onPointerEnter={onPointerEnter}
                onPointerLeave={onPointerLeave}
                onClick={onClick}
            />

            <pointLight
                position={[-6, 9, 5]}
                intensity={3.1}
                color={"white"}
                decay={0.005}
            />

            <CatSectionStars
                twinkleActive={starsTwinkleActive}
                animationProgress={animationProgress}
                rotationAmount={rotationAmount}
                opacity={opacity}
            />
        </group>
    );
}

export default CatSection;
