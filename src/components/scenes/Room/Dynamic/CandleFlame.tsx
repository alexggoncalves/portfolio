import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh, MeshBasicMaterial } from "three";


type CandleFlameProps = { node: Mesh; seed?: number }

const SCALE_AMOUNT = 0.2
const SWAY_AMOUNT = 0.12
const GLOW_AMOUNT = 0.35
const SPEED = 0.5

const CandleFlame = ({node, seed = 0}:CandleFlameProps) => {
    const ref = useRef<Mesh>(null)
    const matRef = useRef<MeshBasicMaterial>(null)

    useFrame(({ clock }) => {
        const flame = ref.current
        const mat = matRef.current
        if (!flame || !mat) return

        const t = (clock.elapsedTime + seed * 10) * SPEED

        const flicker =
            Math.sin(t * 7.3) * 0.5 +
            Math.sin(t * 13.1 + 1.7) * 0.3 +
            Math.sin(t * 23.7 + 4.2) * 0.2

        // occasional bigger dip, like a draft
        const gust = Math.max(0, Math.sin(t * 1.3) * Math.sin(t * 1)) * -1.5

        const f = flicker + gust

        flame.scale.set(1 - f * SCALE_AMOUNT * 1, 1 + f * SCALE_AMOUNT * 0.8, 1 - f * SCALE_AMOUNT * 0.5)
        flame.rotation.z = node.rotation.z + flicker * SWAY_AMOUNT

        const glow = 1 + f * GLOW_AMOUNT
        mat.color.setRGB(5 * glow, 3 * glow, 1.25 * glow)
    })

    return (
        <mesh ref={ref} geometry={node.geometry} position={node.position} rotation={node.rotation}>
            <meshBasicMaterial ref={matRef} color={[5, 3, 1.25]} toneMapped={false} />
        </mesh>
    )
}

export default CandleFlame;