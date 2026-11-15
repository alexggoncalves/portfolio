import { useProgress } from "@react-three/drei"
import useImagePreloader from "./useImagePreloader"
import useSceneStore from "../stores/sceneStore"
import { imagesToPreload } from "../data/content"

const IMAGE_WEIGHT = 0.5
const SCENE_WEIGHT = 0.5

const useLoadingProgress = () => {
    const { loaded, progress: imgProgress } = useImagePreloader(imagesToPreload)
    const { progress: sceneProgress } = useProgress()
    const sceneReady = useSceneStore((s) => s.ready)

    const scene = sceneReady ? 100 : Math.min(sceneProgress, 80)
    const progress = imgProgress * IMAGE_WEIGHT + scene * SCENE_WEIGHT

    return { loaded, progress }
}

export default useLoadingProgress;