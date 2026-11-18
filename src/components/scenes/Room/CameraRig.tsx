import useMediaQuery, { MOBILE_QUERY } from "../../../utils/useMediaQuery";
import { CameraControls, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { clamp, radToDeg } from "three/src/math/MathUtils.js";
import useSceneStore, { type View } from "../../../stores/sceneStore";
import { useThree } from "@react-three/fiber";
import { Object3D, Vector3, type PerspectiveCamera } from "three";

const SENSOR = 36;
const LANDSCAPE_FOCAL = 48;
const PORTRAIT_FOCAL = 56;

const DRAG_SMOOTH = 0.15;
const VIEW_SMOOTH = 0.6;
const MOBILE_VIEW_SMOOTH = 0.7;

const LEFT_LIMIT_OFFSET = 0.1;
const RIGHT_LIMIT_OFFSET = 0.1;

const CameraRig = () => {
    const camera = useThree((s) => s.camera) as PerspectiveCamera
    const gl = useThree((s) => s.gl)
    const { width, height } = useThree((s) => s.size)
    const { nodes } = useGLTF('/room/room.glb') as unknown as { nodes: Record<string, Object3D> }
    const isMobile = useMediaQuery(MOBILE_QUERY)

    const controls = useRef<CameraControls>(null!)
    useEffect(() => { controls.current.disconnect() }, [])

    const view = useSceneStore((s) => s.view)
    const prev = useRef<View>('Center')
    const pan = useRef(0);

    // Match camera fov to blender's camera
    useEffect(() => {
        const focal = isMobile ? PORTRAIT_FOCAL : LANDSCAPE_FOCAL
        const aspect = width / height
        const sensorFov = 2 * Math.atan(SENSOR / 2 / focal) // fov across the longer side

        camera.fov = aspect >= 1
            ? radToDeg(2 * Math.atan(Math.tan(sensorFov / 2) / aspect)) // landscape: sensor = width
            : radToDeg(sensorFov) // portrait: sensor = height

        camera.updateProjectionMatrix()
    }, [camera, isMobile, width, height])

    // Center position
    const center = useMemo(() => {

        const p = nodes.Cam_Center.getWorldPosition(new Vector3())
        const t = nodes.Cam_Center_Target.getWorldPosition(new Vector3())
        const right = new Vector3().subVectors(t, p).cross(camera.up).normalize()

        return { p, t, right, dist: p.distanceTo(t) }
    }, [nodes, camera])

    // ==== Views ===== 
    const goTo = (v: View, animate = true) => {
        const p = nodes[`Cam_${v}`].getWorldPosition(new Vector3())
        const t = nodes[`Cam_${v}_Target`].getWorldPosition(new Vector3())

        // Return to last pan position
        if (v === 'Center') {
             const centerOffset = isMobile ? -0.35 : 0;
            t.y += centerOffset;
            p.y -= centerOffset/4;

            p.addScaledVector(center.right, pan.current)
            t.addScaledVector(center.right, pan.current)
        }

        if(v === "Music"){
            const musicOffset = isMobile ? -0.35 : 0;
            t.y += musicOffset;
        }

        return controls.current.setLookAt(p.x, p.y, p.z, t.x, t.y, t.z, animate)
    }

    // Start at the current view, no animation
    useEffect(() => { goTo(useSceneStore.getState().view, false) }, [])

    // Animate camera when the view changes
    useEffect(() => {
        const from = prev.current;
        prev.current = view;
        if (from === view) return;

        controls.current.smoothTime = isMobile ? MOBILE_VIEW_SMOOTH : VIEW_SMOOTH;

        (async () => {
            if (from !== 'Center' && view !== 'Center') await goTo('Center')
            await goTo(view);
        })()
    }, [view])

    // ==== Mobile pan ====
    const limits = useMemo(() => {
        const aspect = width / height
        const sensorHalf = SENSOR / 2 / PORTRAIT_FOCAL
        const mobileHalf = aspect >= 1 ? sensorHalf : sensorHalf * aspect
        const desktopHalf = SENSOR / 2 / LANDSCAPE_FOCAL

        return {
            max: Math.max(0, center.dist * (desktopHalf - mobileHalf)),
            worldPerPx: (2 * center.dist * mobileHalf) / width,
        }
    }, [center, width, height])

    useEffect(() => {
        if (!isMobile) return
        const el = gl.domElement
        el.style.touchAction = 'pan-y' // vertical swipes still scroll the page

        let id: number | null = null
        let startX = 0
        let startPan = 0

        const onDown = (e: PointerEvent) => {
            if (useSceneStore.getState().view !== 'Center') return
            id = e.pointerId
            startX = e.clientX
            startPan = pan.current
            controls.current.smoothTime = DRAG_SMOOTH
        }

        const onMove = (e: PointerEvent) => {
            if (e.pointerId !== id) return
            pan.current = clamp(
                startPan - (e.clientX - startX) * limits.worldPerPx,
                -limits.max + LEFT_LIMIT_OFFSET,
                limits.max - RIGHT_LIMIT_OFFSET,
            )
            goTo('Center')
        }

        const onUp = (e: PointerEvent) => {
            if (e.pointerId === id) id = null
        }

        el.addEventListener('pointerdown', onDown)
        el.addEventListener('pointermove', onMove)
        el.addEventListener('pointerup', onUp)
        el.addEventListener('pointercancel', onUp) // fires when the browser starts scrolling

        return () => {
            el.removeEventListener('pointerdown', onDown)
            el.removeEventListener('pointermove', onMove)
            el.removeEventListener('pointerup', onUp)
            el.removeEventListener('pointercancel', onUp)
            el.style.touchAction = ''
        }
    }, [isMobile, gl, center, limits])

    return (
        <CameraControls
            ref={controls}
            smoothTime={isMobile ? MOBILE_VIEW_SMOOTH : VIEW_SMOOTH}
            mouseButtons={{ left: 0, middle: 0, right: 0, wheel: 0 }}
            touches={{ one: 0, two: 0, three: 0 }}
        />
    )
}

export default CameraRig