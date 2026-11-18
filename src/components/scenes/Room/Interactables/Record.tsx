import { useRef } from "react"
import { padNumber } from "../../../../utils/stringUtils"
import type { Mesh, MeshBasicMaterial, MeshPhysicalMaterial, Object3D } from "three"
import type { GLTF } from "three/examples/jsm/Addons.js"
import { useGLTF } from "@react-three/drei"

type RecordGLTF = GLTF & {
    nodes: {
        ToneArm: Mesh
        VinylPlayer: Mesh
        Vinyl_Target: Object3D
    } & {
        [K: `Record_${string}_Sleeve` | `Record_${string}_Disc` | `Record_${string}_Disc_${number}`]: Mesh
    } & {
        [K: `Record_${string}`]: Object3D
    }
}

type RecordProps = {
    slot: number
    sleeveMat: MeshBasicMaterial
    discMat: MeshPhysicalMaterial
}

const Record = ({ slot, sleeveMat, discMat }: RecordProps) => {
    const { nodes } = useGLTF('/room/room.glb') as unknown as RecordGLTF
    const id = padNumber(slot)

    const root = nodes[`Record_${id}`]
    const sleeve = nodes[`Record_${id}_Sleeve`]
    const discRoot = nodes[`Record_${id}_Disc`]
    const disc = nodes[`Record_${id}_Disc_1`]
    const discLabel = nodes[`Record_${id}_Disc_2`]

    const sleeveRef = useRef(null)
    const discRef = useRef(null)

    return (<>
        <group position={root.position} rotation={root.rotation} scale={root.scale}>
            <mesh ref={sleeveRef} geometry={sleeve.geometry} material={sleeveMat}
                position={sleeve.position} rotation={sleeve.rotation} />
            <mesh ref={discRef}
                geometry={disc.geometry}
                material={discMat}
                position={discRoot.position}
                rotation={discRoot.rotation}
            />
            <mesh
                geometry={discLabel.geometry}
                material={sleeveMat}
                position={discRoot.position}
                rotation={discRoot.rotation}
            />

        </group>
    </>
    )
}

export default Record