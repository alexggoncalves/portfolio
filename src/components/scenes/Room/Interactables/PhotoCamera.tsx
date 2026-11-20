import { Html, useCursor, useEnvironment, useGLTF, useTexture } from "@react-three/drei"
import { useEffect, useMemo, useRef, useState } from "react"
import { Group, LinearFilter, MathUtils, MeshStandardMaterial, Object3D, PerspectiveCamera, SRGBColorSpace, Vector3, type Mesh } from "three"
import type { GLTF } from "three/examples/jsm/Addons.js"
import { useFrame } from "@react-three/fiber"

import useMediaQuery, { MOBILE_QUERY } from "../../../../utils/useMediaQuery"
import useSceneStore from "../../../../stores/sceneStore"

import CamScreen from "./CamScreen"
import CamButton from "./CamButton"

import { photos } from "../../../../data/content"

type PhotoCameraGLTF = GLTF & {
    nodes: {
        PhotoCam: Object3D
        PhotoCam_Body: Mesh
        PhotoCam_Screen: Mesh
        PhotoCam_LensGlass: Mesh
        PhotoCam_BtnL: Mesh
        PhotoCam_BtnR: Mesh
        Cam_Camera: Object3D
        Cam_Camera_Target: Object3D
    }
}

const CAM_W = 0.211; // Model width
const CAM_H = 0.14; // Model height
const FILL = 0.65; // Percentage of screen to fill 
const MOBILE_FILL = 0.9;

const HOVER_INTENSITY = 0.01; // Emission intensity on hover

// Move and turn animation
const ANIMATION_SPEED = 1.8;
const DELAY = 0;

// Button press yaw animation
const YAW_IMPULSE = 1
const YAW_STIFFNESS = 100
const YAW_DAMPING = 12

const lookTarget = new Vector3();
export const photoCamFocus = new Vector3();

const PhotoCamera = () => {
    const isMobile = useMediaQuery(MOBILE_QUERY);
    const { nodes } = useGLTF('/room/room.glb') as unknown as PhotoCameraGLTF

    const view = useSceneStore((s) => s.view)
    const setView = useSceneStore((s) => s.setView)

    // Load texture and hdr
    const camTex = useTexture("/room/textures/photo_cam.webp")
    const env = useEnvironment({ files: '/room/environments/camera.hdr' })
    camTex.flipY = false
    camTex.colorSpace = SRGBColorSpace
    camTex.generateMipmaps = false;
    camTex.minFilter = LinearFilter

    // Create material
    const camMat = useMemo(() => new MeshStandardMaterial({
        map: camTex,
        roughness: 0.6,
        metalness: 0.6,
        envMap: env,
        envMapIntensity: 1.7,
    }), [camTex, env])
    useEffect(() => () => camMat.dispose(), [camMat]) // dispose material

    // Save camera rest position
    const rest = useMemo(() => ({
        pos: nodes.PhotoCam.position.clone(),
        rot: nodes.PhotoCam.quaternion.clone(),
    }), [nodes])

    const ctaPos = useMemo(() =>
        new Vector3(
            rest.pos.x + CAM_W / 2,
            rest.pos.y + CAM_H,
            rest.pos.z
        )
        , [rest])

    // Get forward vector for the camera view
    const forward = useMemo(() => (
        new Vector3().subVectors(nodes.Cam_Camera_Target.position, nodes.Cam_Camera.position).normalize()
    ), [nodes])

    // Camera animation
    const cameraRef = useRef<Group>(null);
    const waitRef = useRef(0)
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

    // Highlight camera on hover
    const [hovered, setHovered] = useState(false)
    useCursor(hovered && view !== "Camera")
    useEffect(() => {
        camMat.emissive.set((hovered && view !== "Camera") ? '#ffffff' : '#000000')
        camMat.emissiveIntensity = (hovered && view !== "Camera") ? HOVER_INTENSITY : 0
    }, [hovered, camMat, view])

    // Photo index
    const photoIndex = useSceneStore((s) => s.photoIndex)
    const stepPhoto = useSceneStore((s) => s.stepPhoto)
    const photoPress = useSceneStore((s) => s.photoPress)

    useEffect(() => {
        if (photoPress.id === 0) return // skip on mount
        yawVelocity.current += photoPress.dir * YAW_IMPULSE
    }, [photoPress])

    // Button press yaw animation
    const yawRef = useRef<Group>(null)
    const yawVelocity = useRef(0)
    useFrame((_, delta) => {
        const group = yawRef.current
        if (!group) return

        const dt = Math.min(delta, 1 / 30)
        const angle = group.rotation.y
        const velocity = yawVelocity.current

        const springForce = -YAW_STIFFNESS * angle // Pull back toward 0
        const dampingForce = -YAW_DAMPING * velocity // Slow motion down
        const acceleration = springForce + dampingForce

        // Apply spring physics
        yawVelocity.current = velocity + acceleration * dt
        group.rotation.y = angle + yawVelocity.current * dt
    })

    return (
        <>
            <Html aria-disabled position={ctaPos} className={`room-scene__cta ${view !== "Center" ? "room-scene__cta--hidden" : ""}`}>
                <img src="/ArrowLeft.svg" alt="" className="room-scene__cta-arrow" draggable="false" />
                <div className={`room-scene__cta-text`}>
                    Press here for photos
                </div>
            </Html>

            {/* Camera Hit Target */}
            <group
                position={nodes.PhotoCam.position}
                rotation={nodes.PhotoCam.rotation}
                scale={nodes.PhotoCam.scale}
            >
                <mesh
                    position={nodes.PhotoCam_Body.position}
                    rotation={nodes.PhotoCam_Body.rotation}
                    onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
                    onPointerOut={() => setHovered(false)}
                    onClick={() => setView('Camera')}
                >
                    <boxGeometry args={[CAM_W + 0.02, CAM_H + 0.03, 0.01]}></boxGeometry>
                    <meshBasicMaterial transparent opacity={0}></meshBasicMaterial>
                </mesh>
            </group>


            <group ref={cameraRef} position={nodes.PhotoCam.position} rotation={nodes.PhotoCam.rotation} scale={nodes.PhotoCam.scale}>
                <group ref={yawRef}>
                    {/* Body */}
                    <mesh
                        geometry={nodes.PhotoCam_Body.geometry}
                        material={camMat}
                        position={nodes.PhotoCam_Body.position}
                        rotation={nodes.PhotoCam_Body.rotation}
                    />

                    {/* Lens Glass */}
                    <mesh
                        geometry={nodes.PhotoCam_LensGlass.geometry}
                        position={nodes.PhotoCam_LensGlass.position}
                        rotation={nodes.PhotoCam_LensGlass.rotation}
                    >
                        <meshPhysicalMaterial
                            color="#111"
                            roughness={0.3}
                            envMap={env}
                            envMapIntensity={1}
                            transparent
                            opacity={0.5} />
                    </mesh>

                    {/* Screen */}
                    <CamScreen node={nodes.PhotoCam_Screen} photos={photos} index={photoIndex} />

                    {/* Buttons */}
                    <CamButton
                        node={nodes.PhotoCam_BtnL}
                        camMaterial={camMat}
                        active={view === "Camera"}
                        dir={-1}
                        onPress={() => stepPhoto(-1)}
                        hoverIntensity={HOVER_INTENSITY}
                    />
                    <CamButton
                        node={nodes.PhotoCam_BtnR}
                        camMaterial={camMat}
                        active={view === "Camera"}
                        dir={1}
                        onPress={() => stepPhoto(1)}
                        hoverIntensity={HOVER_INTENSITY}
                    />
                </group>

            </group>
        </>
    )
}

export default PhotoCamera;