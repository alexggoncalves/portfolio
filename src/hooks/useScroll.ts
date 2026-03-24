import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";

function useScroll(
    scrollSpeed: number = 0.003,
    touchSpeed: number = 0.1,
) {
    const scrollDelta = useRef(0);
    const isTouch = useRef(false);
    const isFingerDown = useRef(false);

    const velocityRef = useRef(0);
    const lastDirectionRef = useRef<1 | -1 | 0>(0);

    useEffect(() => {
        // WHEEL SCROLL
        function handleWheel(e: WheelEvent) {
            e.preventDefault();
            isTouch.current = false;

            const delta = e.deltaY * scrollSpeed;
            const direction = Math.sign(delta) as 1 | -1 | 0;

            if (
                direction != 0 &&
                lastDirectionRef.current != 0 &&
                direction !== lastDirectionRef.current
            ) {
                velocityRef.current = 0;
            }

            lastDirectionRef.current = direction;
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

            const direction = Math.sign(delta) as 1 | -1 | 0;

            lastTouchY = touchY;

            // Ignore small movements
            if (Math.abs(delta) < 3) return;

            isDragging = true;

            if (
                direction !== 0 &&
                lastDirectionRef.current !== 0 &&
                direction !== lastDirectionRef.current
            ) {
                velocityRef.current = 0;
            }

            lastDirectionRef.current = direction;
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

    useFrame((_state, _delta) => {
        // 1. Use a simple multiplier for decay
    // (Adjust these numbers slightly if it feels too fast/slow)
    const decay = isFingerDown.current ? 0.75 : (isTouch.current ? 0.96 : 0.9);
    
    velocityRef.current *= decay;

    // 2. Clear out the microscopic "noise"
    // If it's not moving at least 1/10th of a pixel, just stop.
    if (Math.abs(velocityRef.current) < 0.1) {
        velocityRef.current = 0;
    }

    // 3. Output the velocity directly
    // Removing 'delta' here is what stops the twitching.
    scrollDelta.current = velocityRef.current;
    });

    return scrollDelta;
}

export default useScroll;
