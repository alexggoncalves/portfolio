import { useEnvironment, useGLTF, useTexture } from "@react-three/drei"
import { useEffect, useMemo, useRef, useState } from "react"
import { Group, MathUtils, MeshStandardMaterial, Object3D, PerspectiveCamera, SRGBColorSpace, Vector3, type Mesh } from "three"
import type { GLTF } from "three/examples/jsm/Addons.js"
import useSceneStore from "../../../../stores/sceneStore"
import { useFrame } from "@react-three/fiber"
import PhotoCameraScreen from "./PhotoCameraScreen"
import useMediaQuery, { MOBILE_QUERY } from "../../../../utils/useMediaQuery"

type PhotoCameraGLTF = GLTF & {
    nodes: {
        PhotoCam: Object3D
        PhotoCam_Body: Mesh
        PhotoCam_LensGlass: Mesh
        Cam_Camera: Object3D
        Cam_Camera_Target: Object3D
    }
}

const ANIMATION_SPEED = 1.8;
const DELAY = 0
const CAM_W = 0.211  // model width
const CAM_H = 0.14  // model height
const FILL = 0.7
const MOBILE_FILL = 0.95;

const lookTarget = new Vector3()
export const photoCamFocus = new Vector3()

const PhotoCamera = () => {
    const isMobile = useMediaQuery(MOBILE_QUERY);

    const [hovered, setHovered] = useState(false)
    const waitRef = useRef(0)

    const { nodes } = useGLTF('/room/room.glb') as unknown as PhotoCameraGLTF
    const env = useEnvironment({ files: '/room/environments/camera.hdr' })
    const cameraRef = useRef<Group>(null);
    const view = useSceneStore((s) => s.view)
    const setView = useSceneStore((s) => s.setView)

    // Texture
    const camTex = useTexture("/room/textures/photo_cam.webp")
    camTex.flipY = false
    camTex.colorSpace = SRGBColorSpace

    const camMat = useMemo(() => new MeshStandardMaterial({
        map: camTex,
        roughness: 0.6,
        metalness: 0.6,
        envMap: env,
        envMapIntensity: 1.7,
    }), [camTex, env])

    // Save camera rest position
    const rest = useMemo(() => ({
        pos: nodes.PhotoCam.position.clone(),
        rot: nodes.PhotoCam.quaternion.clone(),
    }), [nodes])

    // Get forward vector for the camera view
    const forward = useMemo(() => (
        new Vector3().subVectors(nodes.Cam_Camera_Target.position, nodes.Cam_Camera.position).normalize()
    ), [nodes])

    useEffect(() => {
        camMat.emissive.set((hovered && view !== "Camera") ? '#ffffff' : '#000000')
        camMat.emissiveIntensity = (hovered && view !== "Camera") ? 0.08 : 0
    }, [hovered, camMat, view])

    const dummy = useMemo(() => new Object3D(), [])
    useFrame((state, delta) => {
        const camera = cameraRef.current
        if (!camera) return;

        camera.getWorldPosition(photoCamFocus)

        const t = 1 - Math.exp(-ANIMATION_SPEED * delta) // step

        if (view === "Camera") {
            // Wait for delay
            waitRef.current += delta
            if (waitRef.current < DELAY) return

            const cam = state.camera as PerspectiveCamera
            const tanHalf = Math.tan(MathUtils.degToRad(cam.fov) / 2)

            // Get distance from camera to model so it fits in the screen
            const fill = isMobile ? MOBILE_FILL : FILL;
            const distForHeight = (CAM_H / fill / 2) / tanHalf
            const distForWidth = (CAM_W / fill / 2) / (tanHalf * cam.aspect)
            const dist = Math.max(distForHeight, distForWidth)

            // Put model in front of the final camera pose position
            dummy.position.copy(nodes.Cam_Camera.position).addScaledVector(forward, dist)
            dummy.position.y -= CAM_H / 2;

            // Rotate the model so it faces the final camera pose
            dummy.lookAt(lookTarget.copy(dummy.position).sub(forward))
            dummy.rotateY(Math.PI)

            // Apply position and rotation lerp
            camera.position.lerp(dummy.position, t)
            camera.quaternion.slerp(dummy.quaternion, t)
        } else {
            waitRef.current = 0;
            // Return to rest position and rotation
            camera.position.lerp(rest.pos, t)
            camera.quaternion.slerp(rest.rot, t)
        }
    })

    return (
        <>
            <group ref={cameraRef} position={nodes.PhotoCam.position} rotation={nodes.PhotoCam.rotation} scale={nodes.PhotoCam.scale}>
                {/* Body */}
                <mesh
                    geometry={nodes.PhotoCam_Body.geometry}
                    material={camMat}
                    position={nodes.PhotoCam_Body.position}
                    rotation={nodes.PhotoCam_Body.rotation}
                    onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
                    onPointerOut={() => setHovered(false)}
                    onClick={() => setView('Camera')}
                />

                {/* Lens Glass */}
                <mesh geometry={nodes.PhotoCam_LensGlass.geometry} position={nodes.PhotoCam_LensGlass.position} rotation={nodes.PhotoCam_LensGlass.rotation}>
                    <meshPhysicalMaterial color="#111" roughness={0.3} envMap={env} envMapIntensity={1} transparent opacity={0.2} />
                </mesh>

                {/* Screen and buttons */}
                <PhotoCameraScreen buttonMaterial={camMat} active={view === "Camera"}/>
            </group>
        </>

    )
}

export default PhotoCamera;