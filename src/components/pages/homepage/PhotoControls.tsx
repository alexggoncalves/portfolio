import useSceneStore from "../../../stores/sceneStore"
import { ChevronLeft, ChevronRight } from "../../ui/Icons";

const PhotoControls = () => {
    const stepPhoto = useSceneStore((s) => s.stepPhoto)
    
    return (
        <div className="photo-controls">
            <button type="button" className="button--glass" onClick={() => stepPhoto(-1)} aria-label="Previous photo">
                <ChevronLeft/>
            </button>
            <button type="button" className="button--glass" onClick={() => stepPhoto(1)} aria-label="Next photo">
                <ChevronRight/>
            </button>
        </div>
    )
}

export default PhotoControls;