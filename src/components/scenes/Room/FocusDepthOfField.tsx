import { useRef } from "react"
import type { DepthOfFieldEffect } from "postprocessing"
import { MathUtils } from "three"
import { useFrame } from "@react-three/fiber"
import { DepthOfField } from "@react-three/postprocessing"
import useSceneStore from "../../../stores/sceneStore"
import { photoCamFocus } from "./Interactables/PhotoCamera"

const BLUR = 6
const FOCUS_RANGE = 7 // world units of depth that stay sharp

const FocusDepthOfField = () => {
    const ref = useRef<DepthOfFieldEffect>(null)
    const view = useSceneStore((s) => s.view)

    useFrame((state, delta) => {
        const dof = ref.current
        if (!dof) return

        // focus exactly on the photo camera, in world units
        dof.target = null
        dof.cocMaterial.worldFocusDistance = state.camera.position.distanceTo(photoCamFocus)
        dof.cocMaterial.worldFocusRange = FOCUS_RANGE

        const t = 1 - Math.exp(-2 * delta)
        dof.bokehScale = MathUtils.lerp(dof.bokehScale, view === "Camera" ? BLUR : 0, t)
    })

    return <DepthOfField ref={ref} bokehScale={0} />
}

export default FocusDepthOfField