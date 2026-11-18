import { useEffect, useMemo, useRef, useState } from "react"
import useSceneStore from "../../../../stores/sceneStore";
import { Html, useCursor, useEnvironment, useGLTF } from "@react-three/drei";
import { Mesh, MeshBasicMaterial, Quaternion, Texture, Vector3, type TextureEventMap } from "three";
import type { GLTF } from "three/examples/jsm/Addons.js";
import { useFrame } from "@react-three/fiber";
import { degToRad } from "three/src/math/MathUtils.js";

const PLAYER_W = 0.438;
const PLAYER_H = 0.146;
const PLAYER_D = 0.402;

const HOVER_INTENSITY = 0.01;
const LID_ANIMATION_SPEED = 1.8;

type VinylPlayerGLTF = GLTF & {
    nodes: {
        VinylLid: Mesh
        ToneArm: Mesh
        VinylPlayer: Mesh
    }
}

type VinylPlayerProps = {
    standTex: Texture<unknown, TextureEventMap>
}

const VinylPlayer = ({ standTex }: VinylPlayerProps) => {
    const { nodes } = useGLTF('/room/room.glb') as unknown as VinylPlayerGLTF
    const env = useEnvironment({ files: '/room/environments/vynilStand.hdr' })

    const view = useSceneStore((s) => s.view)
    const setView = useSceneStore((s) => s.setView)

    const ctaPos = useMemo(() => {
        const pos = nodes.VinylPlayer.position
        return new Vector3(
            pos.x + 0.2,
            pos.y + 0.03,
            pos.z
        )
    }, [nodes])

    const highlightMaterial = useMemo(() => new MeshBasicMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 0,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
    }), [])

    // Highlight player on hover
    const [hovered, setHovered] = useState(false)
    useCursor(hovered && view !== "Music")
    useEffect(() => {
        highlightMaterial.opacity =
            hovered && view !== "Music" ? HOVER_INTENSITY : 0
    }, [hovered, view, highlightMaterial])

    useEffect(() => () => highlightMaterial.dispose(), [highlightMaterial])

    // Lid animation
    const lidRef = useRef<Mesh>(null);
    const lidHighlightRef = useRef<Mesh>(null);
    const closedLidRot = useMemo(
        () => nodes.VinylLid.quaternion.clone(),
        [nodes]
    )
    const openLidRot = useMemo(
        () => {
            return new Quaternion().setFromAxisAngle(
                new Vector3(1, 0, 0), degToRad(-80)
            ).multiply(closedLidRot)
        }, [closedLidRot]
    )

    useFrame((_state, delta) => {
        const lid = lidRef.current
        const lidHighlight = lidHighlightRef.current
        if (!lid || !lidHighlight) return;

        const t = 1 - Math.exp(-LID_ANIMATION_SPEED * delta)

        if (view === "Music") {
            lid.quaternion.slerp(openLidRot, t)
            lidHighlight.quaternion.slerp(openLidRot, t)
        } else {
            lid.quaternion.slerp(closedLidRot, t)
            lidHighlight.quaternion.slerp(closedLidRot, t)
        }
    })

    return <>
        <Html aria-disabled position={ctaPos} className={`room-scene__cta ${view !== "Center" ? "room-scene__cta--hidden" : ""}`}>
            <img src="/ArrowLeft.svg" alt="" className="room-scene__cta-arrow" draggable="false" />

            <div className={`room-scene__cta-text`}>
                Press here for music
            </div>

        </Html>

        {/* VinylPlayer */}
        <mesh
            geometry={nodes.VinylPlayer.geometry}
            position={nodes.VinylPlayer.position}
        >
            <meshBasicMaterial map={standTex}></meshBasicMaterial>
        </mesh>

        {/* Player Collider */}
        <mesh
            position={nodes.VinylPlayer.position}
            onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
            onPointerOut={() => setHovered(false)}
            onClick={() => setView('Music')}
        >
            <boxGeometry args={[PLAYER_W, PLAYER_H, PLAYER_D]} />
            <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {/* Lid */}
        <mesh
            ref={lidRef}
            geometry={nodes.VinylLid.geometry}
            position={nodes.VinylLid.position}
        >
            <meshPhysicalMaterial
                color="#111"
                roughness={0.3}
                envMap={env}
                envMapIntensity={2}
                transparent
                opacity={0.6} />
        </mesh>

        {/* Tone Arm */}
        <mesh geometry={nodes.ToneArm.geometry} position={nodes.ToneArm.position} rotation={nodes.ToneArm.rotation}>
            <meshBasicMaterial map={standTex} />
        </mesh>

        {/* Hover higlight */}
        <mesh
            geometry={nodes.VinylPlayer.geometry}
            position={nodes.VinylPlayer.position}
            material={highlightMaterial}
        />
        <mesh
            ref={lidHighlightRef}
            geometry={nodes.VinylLid.geometry}
            position={nodes.VinylLid.position}
            material={highlightMaterial}
        />
    </>
}

export default VinylPlayer;