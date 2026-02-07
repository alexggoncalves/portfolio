
//----------------------------------------------------------------------------
// Cursor tracker: Tracks the cursor position and saves it to the cursor store

import { useEffect } from "react";
import useCursorStore from "../../stores/cursorStore";

//----------------------------------------------------------------------------
function CursorTracker() {

    const {setCursorPosition, setCursorEnabled} = useCursorStore()

    useEffect(() => {
            const handleMove = (e: MouseEvent) => {
                setCursorPosition({ x: e.clientX, y: e.clientY });
            };
    
            const handleMouseLeave = () => {
                setCursorEnabled(false);
            };
    
            const handleMouseEnter = () => {
                setCursorEnabled(true);
            };
    
            window.addEventListener("mousemove", handleMove);
            window.addEventListener("mouseout", handleMouseLeave);
            window.addEventListener("mouseover", handleMouseEnter);
    
            return () => {
                window.removeEventListener("mousemove", handleMove);
                window.removeEventListener("mouseout", handleMouseLeave);
                window.removeEventListener("mouseover", handleMouseEnter);
            };
        }, []);

    return null
}

export default CursorTracker;
