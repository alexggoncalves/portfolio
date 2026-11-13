import { useTexture } from "@react-three/drei"
import { useMemo } from "react"
import { Mesh, SRGBColorSpace, Vector3 } from "three"


const Moon = ({ from, target }: { from: Vector3; target: Vector3 }) => {
    const moonTex = useTexture('/room/textures/moon.webp', (t) => { t.colorSpace = SRGBColorSpace })
    const offset = useMemo(() => target.clone().sub(from).normalize().multiplyScalar(80), [from, target])

    return (
        <mesh
            onBeforeRender={function (this: Mesh, _r, _s, camera) {
                this.position.copy(camera.position).add(offset)
                this.quaternion.copy(camera.quaternion)
                this.updateMatrixWorld()
            }}
        >
            <circleGeometry args={[70 * 0.03, 32]} />
            <meshBasicMaterial map={moonTex} color={[1.1, 1.1, 1.1]} toneMapped={false} />
        </mesh>
    )
}

export default Moon;