import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, type ComponentRef } from "react";
import { Vector2, Vector3 } from "three";
import { VFXEmitter, VFXParticles, AppearanceMode, RenderMode } from "wawa-vfx";
import useAsciiRenderStore from "../../../stores/asciiRenderStore";
import useSceneStore from "../../../stores/sceneStore";

type VFXEmitterRef = ComponentRef<typeof VFXEmitter>;

const DRAG_EMIT_DIST = 0.0015;

function Fireworks() {
    const { pointer, viewport } = useThree();
    const emitterRef = useRef<VFXEmitterRef>(null);
    const worldPos = useRef(new Vector3());
    const dragging = useRef(false);
    const lastEmit = useRef(new Vector2(Number.NaN, Number.NaN));

    const isFireworksLocked = useSceneStore((s) => s.isFireworksLocked);
    const viewCellSize = useAsciiRenderStore((s)=>s.viewCellSize)

    useFrame(() => {
        

        worldPos.current.set(
            (pointer.x * viewport.width) / 2,
            (pointer.y * viewport.height) / 2,
            0,
        );

        if (!dragging.current || !emitterRef.current || isFireworksLocked) return;

        const x = worldPos.current.x;
        const y = worldPos.current.y;
        const dx = x - lastEmit.current.x;
        const dy = y - lastEmit.current.y;
        if (dx * dx + dy * dy < DRAG_EMIT_DIST) return;

        emitterRef.current.emitAtPos(worldPos.current, true);
        lastEmit.current.set(x, y);
    });

    useEffect(() => {
        const onPointerDown = (e: PointerEvent) => {
            if (e.button !== 0) return;
            if(isFireworksLocked) return;
            
            dragging.current = true;
            lastEmit.current.set(Number.NaN, Number.NaN);
            emitterRef.current?.emitAtPos(worldPos.current, true);
            lastEmit.current.set(worldPos.current.x, worldPos.current.y);
        };

        const endDrag = () => {
            dragging.current = false;
        };

        document.body.addEventListener("pointerdown", onPointerDown);
        window.addEventListener("pointerup", endDrag);
        window.addEventListener("pointercancel", endDrag);
        return () => {
            document.body.removeEventListener("pointerdown", onPointerDown);
            window.removeEventListener("pointerup", endDrag);
            window.removeEventListener("pointercancel", endDrag);
        };
    }, []);

    return (
        <>
            <VFXParticles
                name="fireworks"
                settings={{
                    nbParticles: 8000,
                    gravity: [0, -6, 0],
                    fadeSize: [0.05, 0.95],
                    fadeAlpha: [0, 1],
                    intensity: 2,
                    appearance: AppearanceMode.Circular,
                    easeFunction: "easeOutQuad",
                    renderMode: RenderMode.Billboard,
                }}
            />

            <VFXEmitter
                ref={emitterRef}
                autoStart={false}
                emitter="fireworks"
                settings={{

                    loop: false,
                    spawnMode: "burst",
                    duration: 1,
                    nbParticles: 14,
                    delay: 0,
                    particlesLifetime: [0.7, 1.4],
                    startPositionMin: [0, 0, 0],
                    startPositionMax: [0.02, 0.02, 0.02],
                    startRotationMin: [0, 0, 0],
                    startRotationMax: [0, 0, 0],
                    rotationSpeedMin: [0, 0, 0],
                    rotationSpeedMax: [0, 0, 0],
                    directionMin: [-1, -2, -1],
                    directionMax: [1, 1, 1],
                    size: [viewCellSize.w/4, viewCellSize.w/4],
                    speed: [1, 1],
                    colorStart: ["white"],
                    colorEnd: ["#e91e63"],
                }}
            />
        </>
    );
}

export default Fireworks;
