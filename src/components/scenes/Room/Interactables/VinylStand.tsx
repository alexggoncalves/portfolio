import { useEnvironment, useGLTF, useTexture } from "@react-three/drei"
import { useEffect, useMemo, useRef } from "react"
import { MeshBasicMaterial, MeshPhysicalMaterial, NoColorSpace, SRGBColorSpace, type Mesh, type Object3D } from "three"
import type { GLTF } from "three/examples/jsm/Addons.js"
import { padNumber } from "../../../../utils/stringUtils"

import { records } from "../../../../data/content"

type VinylStandGLTF = GLTF & {
    nodes: {
        VinylLid: Mesh
        ToneArm: Mesh
        VinylStand: Mesh
    } & {
        [K: `Record_${string}_Sleeve` | `Record_${string}_Disc`]: Mesh
    } & {
        [K: `Record_${string}`]: Object3D
    }
}

const LIGHTMAP_NEUTRAL = Math.PI
const REST_SHADE = 0.8

const VinylStand = () => {
    const { nodes } = useGLTF('/room/room.glb') as unknown as VinylStandGLTF
    const env = useEnvironment({ preset: 'apartment' })
    // const env = useEnvironment({ files: '/room/env/turntable.hdr' })

    // Colour textures
    const color = useTexture({
        vinyl_stand: "/room/textures/vinyl_stand.webp",
        albums: "/room/textures/albums.webp",
        sleeveLight: "/room/textures/sleeve_lightmap.webp",
    })

    // Data textures
    const data = useTexture({
        grooveNormal: "/room/textures/vinyl_normal.webp",
        grooveAniso: "/room/textures/vinyl_aniso.webp",
    })

    useMemo(() => {
        Object.values(color).forEach(t => { t.flipY = false; t.colorSpace = SRGBColorSpace })
        Object.values(data).forEach(t => { t.flipY = false; t.colorSpace = NoColorSpace })
        color.sleeveLight.channel = 1
        data.grooveNormal.channel = 1
        data.grooveAniso.channel = 1
    }, [color, data])

    const sleeveMats = useMemo(() => records.map(() => new MeshBasicMaterial({
        map: color.albums,
        lightMap: color.sleeveLight,
        lightMapIntensity: LIGHTMAP_NEUTRAL * REST_SHADE,
    })), [color])

    const discMat = useMemo(() => new MeshPhysicalMaterial({
        map: color.albums,
        roughness: 0.35,
        metalness: 0,
        normalMap: data.grooveNormal,
        anisotropy: 1,
        anisotropyMap: data.grooveAniso,
        envMap: env,
        envMapIntensity: 1,
    }), [color, data, env])

    useEffect(() => {
        return () => {
            sleeveMats.forEach(m => m.dispose())
            discMat.dispose()
        }
    }, [sleeveMats, discMat])

    return (
        <>
            {/* Lid */}
            <mesh geometry={nodes.VinylLid.geometry} position={nodes.VinylLid.position} rotation={nodes.VinylLid.rotation}>
                <meshBasicMaterial
                    color="#1f1f1f"
                    transparent
                    opacity={0.6}
                    depthWrite={false}
                />
            </mesh>

            {/* Stand + Vinyl PLayer */}
            <mesh geometry={nodes.VinylStand.geometry}>
                <meshBasicMaterial map={color.vinyl_stand} />
            </mesh>

            {/* Records */}
            {records.map((r, i) => (
                <Record key={r.album} slot={i + 1} nodes={nodes} sleeveMat={sleeveMats[i]} discMat={discMat} />
            ))}

            {/* Tone Arm */}
            <mesh geometry={nodes.ToneArm.geometry} position={nodes.ToneArm.position} rotation={nodes.ToneArm.rotation}>
                <meshBasicMaterial map={color.vinyl_stand} />
            </mesh>
        </>
    )
}

type RecordProps = {
    slot: number
    nodes: VinylStandGLTF['nodes']
    sleeveMat: MeshBasicMaterial
    discMat: MeshPhysicalMaterial
}


function Record({ slot, nodes, sleeveMat, discMat }: RecordProps) {
    const id = padNumber(slot)

    const root = nodes[`Record_${id}`]
    const sleeve = nodes[`Record_${id}_Sleeve`]
    const disc = nodes[`Record_${id}_Disc`]

    const sleeveRef = useRef(null)
    const discRef = useRef(null)

    return (
        <group position={root.position} rotation={root.rotation} scale={root.scale}>
            <mesh ref={sleeveRef} geometry={sleeve.geometry} material={sleeveMat}
                position={sleeve.position} rotation={sleeve.rotation} />
            <mesh ref={discRef} geometry={disc.geometry} material={discMat}
                position={disc.position} rotation={disc.rotation} />
        </group>
    )
}

export default VinylStand