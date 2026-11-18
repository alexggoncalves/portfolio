import { useEnvironment, useGLTF, useTexture } from "@react-three/drei"
import { useEffect, useMemo } from "react"
import { MeshBasicMaterial, MeshPhysicalMaterial, NoColorSpace, SRGBColorSpace, Vector2, type Mesh } from "three"
import type { GLTF } from "three/examples/jsm/Addons.js"

import { records } from "../../../../data/content"
import Record from "./Record"
import VinylPlayer from "./VinylPlayer"

type VinylStandGLTF = GLTF & {
    nodes: {
        VinylLid: Mesh
        ToneArm: Mesh
        VinylStand: Mesh
    }
}

const LIGHTMAP_NEUTRAL = Math.PI;
const REST_SHADE = 0.8;

const VinylStand = () => {
    const { nodes } = useGLTF('/room/room.glb') as unknown as VinylStandGLTF
    const env = useEnvironment({ files: '/room/environments/vynilStand.hdr' })

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
        color.sleeveLight.channel = 0
        data.grooveNormal.channel = 0
        data.grooveAniso.channel = 0
    }, [color, data])

    const sleeveMats = useMemo(() => records.map(() => new MeshBasicMaterial({
        map: color.albums,
        lightMap: color.sleeveLight,
        lightMapIntensity: LIGHTMAP_NEUTRAL * REST_SHADE,
    })), [color])

    const discMat = useMemo(() => new MeshPhysicalMaterial({
        color: "#131313",
        roughness: 0.3,
        metalness: 0.5,
        normalMap: data.grooveNormal,
        normalScale: new Vector2(1, 1),
        anisotropy: 1,
        anisotropyMap: data.grooveAniso,
        envMap: env,
        envMapIntensity: 0.5,
    }), [color, data, env])


    useEffect(() => {
        return () => {
            sleeveMats.forEach(m => m.dispose())
            discMat.dispose()
        }
    }, [sleeveMats, discMat])

    return (
        <>
            <VinylPlayer standTex={color.vinyl_stand} />

            {/* Stand */}
            <mesh geometry={nodes.VinylStand.geometry}>
                <meshBasicMaterial map={color.vinyl_stand} />
            </mesh>

            {/* Records */}
            {records.map((r, i) => (
                <Record key={r.album} slot={i + 1} sleeveMat={sleeveMats[i]} discMat={discMat} />
            ))}
        </>
    )
}



export default VinylStand