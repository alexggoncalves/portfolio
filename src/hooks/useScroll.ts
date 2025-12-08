import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";

function useScroll(
    scrollSpeed: number = 0.002,
    scrollDecay: number = 0.9,
    touchSpeed: number = 0.09,
    touchDecay: number = 0.94
) {
    const [scrollDelta, setScrollDelta] = useState(0);
    const isTouch = useRef(false);
    const isFingerDown = useRef(false);

    const velocityRef = useRef(0);
    const outputRef = useRef(0);
    const lastDeltaSent = useRef(0);

    useEffect(() => {
        // WHEEL SCROLL
        function handleWheel(e: WheelEvent) {
            e.preventDefault();
            isTouch.current = false;

            const delta = e.deltaY * scrollSpeed;

            if (Math.sign(velocityRef.current) !== Math.sign(delta)) {
                velocityRef.current = 0;
            }

            velocityRef.current += delta;
        }

        // TOUCH SCROLL
        let lastTouchY = 0;
        let isDragging = false;
        function handleTouchStart(e: TouchEvent) {
            isTouch.current = true;
            isFingerDown.current = true;
            isDragging = false;

            lastTouchY = e.touches[0].clientY;

            velocityRef.current = 0;
        }

        function handleTouchMove(e: TouchEvent) {
            e.preventDefault();
            const touchY = e.touches[0].clientY;
            const delta = lastTouchY - touchY;
            lastTouchY = touchY;

            // Ignore small movements
            if (Math.abs(delta) < 3) return;

            isDragging = true;

            velocityRef.current = delta * touchSpeed;
        }

        function handleTouchEnd() {
            isFingerDown.current = false;

            if (!isDragging) {
                velocityRef.current = 0;
            }
        }

        window.addEventListener("wheel", handleWheel, { passive: false });
        window.addEventListener("touchstart", handleTouchStart, {
            passive: false,
        });
        window.addEventListener("touchmove", handleTouchMove, {
            passive: false,
        });
        window.addEventListener("touchend", handleTouchEnd, { passive: false });

        return () => {
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, []);

    useFrame((_state, delta) => {
        if (!isFingerDown.current) {
            if (isTouch.current) {
                velocityRef.current *= Math.pow(touchDecay, delta * 60);
            } else {
                velocityRef.current *= Math.pow(scrollDecay, delta * 60);
            }
        } else velocityRef.current *= Math.pow(0.75, delta * 60);

        if (Math.abs(velocityRef.current) < 0.0005) {
            velocityRef.current = 0;
        }

        const newOutput = velocityRef.current * delta * 60;

        // Only update if meaningful change
        if (Math.abs(newOutput - lastDeltaSent.current) > 0.0001) {
            lastDeltaSent.current = newOutput;
            outputRef.current = newOutput;
            setScrollDelta(newOutput);
        }
    });

    return scrollDelta;
}

export default useScroll;
