import useMediaQuery, { MOBILE_QUERY } from "../../../utils/useMediaQuery";
import { MathUtils, Object3D, PerspectiveCamera, Vector3 } from "three";
import { CameraControls, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import type { View } from "../../../stores/sceneStore";
import useSceneStore from "../../../stores/sceneStore";

const SENSOR = 36 // Blender's sensor width
const LANDSCAPE_FOCAL = 50
const PORTRAIT_FOCAL = 56

const CameraRig = () => {
    const isMobile = useMediaQuery(MOBILE_QUERY)
    const camera = useThree((s) => s.camera) as PerspectiveCamera
    const { width, height } = useThree((s) => s.size)

    const { nodes } = useGLTF('/room/room.glb') as unknown as { nodes: Record<string, Object3D> }
    const view = useSceneStore((s) => s.view)

    const controls = useRef<CameraControls>(null!)
    const prev = useRef<View>('Center')

    // Blender-matched fov on the Canvas's own camera
    useEffect(() => {
        const focal = isMobile ? PORTRAIT_FOCAL : LANDSCAPE_FOCAL
        const aspect = width / height
        const sensorFov = 2 * Math.atan(SENSOR / 2 / focal)   // fov across the longer side

        camera.fov = aspect >= 1
            ? MathUtils.radToDeg(2 * Math.atan(Math.tan(sensorFov / 2) / aspect)) // landscape: sensor = width
            : MathUtils.radToDeg(sensorFov)                                        // portrait: sensor = height

        camera.near = 0.05
        camera.far = 200
        camera.updateProjectionMatrix()
    }, [camera, isMobile, width, height])

    const goTo = (v: View, animate = true) => {
        const p = nodes[`Cam_${v}`].getWorldPosition(new Vector3())
        const t = nodes[`Cam_${v}_Target`].getWorldPosition(new Vector3())
        return controls.current.setLookAt(p.x, p.y, p.z, t.x, t.y, t.z, animate)
    }

    // Start at the current view, no animation
    useEffect(() => { goTo(useSceneStore.getState().view, false) }, [])

    // Animate when the view changes; Left <-> Right goes through Center
    useEffect(() => {
        const from = prev.current
        prev.current = view
        if (from === view) return

        (async () => {
            if (from !== 'Center' && view !== 'Center') await goTo('Center')
            await goTo(view)
        })()
    }, [view])

    return (
        <CameraControls
            ref={controls}
            smoothTime={0.6}
            mouseButtons={{ left: 0, middle: 0, right: 0, wheel: 0 }}
            touches={{ one: 0, two: 0, three: 0 }}
        />
    )
}

export default CameraRig