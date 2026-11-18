import { useCursor } from "@react-three/drei"
import { type ThreeEvent } from "@react-three/fiber"
import { useEffect, useMemo, useState } from "react"
import { type Mesh, type MeshStandardMaterial } from "three"
import useSceneStore from "../../../../stores/sceneStore"

type CamButtonProps = {
    node: Mesh
    camMaterial: MeshStandardMaterial
    active: boolean
    dir: 1 | -1
    onPress: () => void
    hoverIntensity?: number
}

const CamButton = ({ node, camMaterial, active, dir, onPress, hoverIntensity = 0.08 }: CamButtonProps) => {
    const [hovered, setHovered] = useState(false);
    const [pressed, setPressed] = useState(false);
    useCursor(hovered && active)

    // Copy cam material for highlight
    const mat = useMemo(() => camMaterial.clone(), [camMaterial])
    useEffect(() => () => mat.dispose(), [mat])

    // Highligh button on hover
    useEffect(() => {
        const intensity = !active ? 0
            : pressed ? hoverIntensity * 2
                : hovered ? hoverIntensity
                    : 0
        mat.emissive.set(intensity > 0 ? '#ffffff' : '#000000')
        mat.emissiveIntensity = intensity
    }, [hovered, pressed, active, mat, hoverIntensity])

    const photoPress = useSceneStore((s) => s.photoPress)

    useEffect(() => {
        if (photoPress.id === 0 || photoPress.dir !== dir || !active) return
        setPressed(true)
        const t = setTimeout(() => setPressed(false), 120)
        return () => clearTimeout(t)
    }, [photoPress, dir, active])

    return (
        <mesh
            geometry={node.geometry}
            material={mat}
            position={node.position}
            rotation={node.rotation}
            onPointerOver={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHovered(true) }}
            onPointerOut={() => { setHovered(false); }}
            onPointerDown={(e) => { e.stopPropagation(); }}
            onClick={(e) => { e.stopPropagation(); if (active) onPress() }}
        />
    )
}

export default CamButton;