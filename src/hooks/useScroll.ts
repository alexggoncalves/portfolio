import { useFrame } from "@react-three/fiber";
import { useEffect, useState } from "react";

function useScroll(scrollSpeed: number = 0.015, touchSpeed: number = 0.1) {
    const [scrollDelta, setScrollDelta] = useState(0);

    useEffect(() => {
        function handleWheel(e: WheelEvent) {
            e.preventDefault();
            setScrollDelta(e.deltaY * scrollSpeed);

            requestAnimationFrame(() => {
                setScrollDelta(0);
            });
        }

        let touchStart = 0;
        let lastTouchY = 0;
        function handleTouchStart(e: TouchEvent) {
            touchStart = e.touches[0].clientY;
            lastTouchY = touchStart;
        }

        function handleTouchMove(e: TouchEvent) {
            const touchY = e.touches[0].clientY;
            const delta = lastTouchY - touchY;
            setScrollDelta(delta * touchSpeed);
            lastTouchY = touchY;
        }

        function handleTouchEnd(e: TouchEvent) {
            setScrollDelta(0);
        }

        window.addEventListener("wheel", handleWheel, { passive: false });
        window.addEventListener("touchstart", handleTouchStart);
        window.addEventListener("touchmove", handleTouchMove);
        window.addEventListener("touchend", handleTouchEnd);

        return () => {
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, []);

    useFrame(()=>{
        
    })

    return scrollDelta;
}

export default useScroll;
