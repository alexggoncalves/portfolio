import { useEnvironment, useGLTF, useTexture } from "@react-three/drei"
import { useMemo } from "react"
import { MeshStandardMaterial, SRGBColorSpace, type Mesh, type Object3D } from "three"
import type { GLTF } from "three/examples/jsm/Addons.js"

type PhotoCameraGLTF = GLTF & {
    nodes: {
        PhotoCam: Object3D
        PhotoCam_Body: Mesh
        PhotoCam_BtnL: Mesh
        PhotoCam_BtnR: Mesh
        PhotoCam_LensGlass: Mesh
        PhotoCam_Screen: Mesh
    }
}

const PhotoCamera = () => {
    const { nodes } = useGLTF('/room/room.glb') as unknown as PhotoCameraGLTF
    const env = useEnvironment({ preset: 'apartment' })
    // const env = useEnvironment({ files: '/room/env/bookcase.hdr' })

    // Texture
    const camTex = useTexture("/room/textures/photo_cam.webp")
    camTex.flipY = false
    camTex.colorSpace = SRGBColorSpace

    const camMat = useMemo(() => new MeshStandardMaterial({
        map: camTex,
        roughness: 0.6,
        metalness: 0,
        envMap: env,
        envMapIntensity: 0.2,
    }), [camTex, env])

    return (
        <>
            <group position={nodes.PhotoCam.position} rotation={nodes.PhotoCam.rotation} scale={nodes.PhotoCam.scale}>
                <mesh geometry={nodes.PhotoCam_Body.geometry} material={camMat} position={nodes.PhotoCam_Body.position} rotation={nodes.PhotoCam_Body.rotation} />
                <mesh geometry={nodes.PhotoCam_BtnL.geometry} material={camMat} position={nodes.PhotoCam_BtnL.position} rotation={nodes.PhotoCam_BtnL.rotation} />
                <mesh geometry={nodes.PhotoCam_BtnR.geometry} material={camMat} position={nodes.PhotoCam_BtnR.position} rotation={nodes.PhotoCam_BtnR.rotation} />
                <mesh geometry={nodes.PhotoCam_LensGlass.geometry} position={nodes.PhotoCam_LensGlass.position} rotation={nodes.PhotoCam_LensGlass.rotation}>
                    <meshPhysicalMaterial color="#111" roughness={0.05} envMap={env} envMapIntensity={1.5} />
                </mesh>
                <mesh geometry={nodes.PhotoCam_Screen.geometry} position={nodes.PhotoCam_Screen.position} rotation={nodes.PhotoCam_Screen.rotation}>
                    <meshBasicMaterial color={[1.2, 1.2, 1.2]} toneMapped={false} />
                </mesh>
            </group>
        </>

    )
}

export default PhotoCamera;