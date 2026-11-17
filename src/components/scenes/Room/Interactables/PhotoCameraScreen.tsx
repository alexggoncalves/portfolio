import { useGLTF, useTexture } from "@react-three/drei"
import { Material, SRGBColorSpace, type Mesh } from "three"
import type { GLTF } from "three/examples/jsm/Addons.js"

import { photos as PHOTOS } from "../../../../data/content"
import { useMemo, useState } from "react"

type PhotoCameraScreenGLTF = GLTF & {
    nodes: {
        PhotoCam_BtnL: Mesh
        PhotoCam_BtnR: Mesh
        PhotoCam_Screen: Mesh
    }
}

type PhotoCameraScreenProps = {
    buttonMaterial: Material
    active: boolean
}

const SCREEN_ASPECT = 3 / 2

const PhotoCameraScreen = ({ buttonMaterial, active }: PhotoCameraScreenProps) => {
    const { nodes } = useGLTF('/room/room.glb') as unknown as PhotoCameraScreenGLTF
    const photos = useTexture(PHOTOS.map((p) => p.url));
    const [index, setIndex] = useState(0)

    useMemo(() => {
        photos.forEach((tex) => {
            tex.flipY = false
            tex.colorSpace = SRGBColorSpace

            const img = tex.image as HTMLImageElement
            const aspect = img.width / img.height
            if (aspect > SCREEN_ASPECT) tex.repeat.set(SCREEN_ASPECT / aspect, 1)
            else tex.repeat.set(1, aspect / SCREEN_ASPECT)
            tex.offset.set((1 - tex.repeat.x) / 2, (1 - tex.repeat.y) / 2)
        })
    }, [photos])


    const step = (dir: 1 | -1) => {
        if (!active) return
        setIndex((i) => (i + dir + photos.length) % photos.length)
    }

    return (
        <>
            {/* Screen */}
            <mesh geometry={nodes.PhotoCam_Screen.geometry} position={nodes.PhotoCam_Screen.position} rotation={nodes.PhotoCam_Screen.rotation}>
                <meshStandardMaterial
                    color="black"
                    emissive="white"
                    emissiveMap={photos[index]}
                    emissiveIntensity={1.4}
                    roughness={1}
                    toneMapped={false}
                />

                This giv
            </mesh>

            {/* Buttons */}
            <mesh
                geometry={nodes.PhotoCam_BtnL.geometry}
                material={buttonMaterial}
                position={nodes.PhotoCam_BtnL.position}
                rotation={nodes.PhotoCam_BtnL.rotation}
                onClick={(e) => { e.stopPropagation(); step(-1) }}
            />
            <mesh
                geometry={nodes.PhotoCam_BtnR.geometry}
                material={buttonMaterial}
                position={nodes.PhotoCam_BtnR.position}
                rotation={nodes.PhotoCam_BtnR.rotation}
                onClick={(e) => { e.stopPropagation(); step(1) }}
            />
        </>

    )
}

export default PhotoCameraScreen;