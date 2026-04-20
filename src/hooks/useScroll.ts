import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";

const wheelSpeed = 0.0045;
const wheelDecay = 0.8;

const touchSpeed = 0.028;
const touchDecay = 0.965;
const touchMoveDecay = 0.72;

function useScroll() {
    const scrollDelta = useRef(0);
    const isTouch = useRef(false);
    const isFingerDown = useRef(false);

    const velocityRef = useRef(0);
    const lastDirectionRef = useRef<1 | -1 | 0>(0);
    const isDragging = useRef(false);

    useEffect(() => {
        // WHEEL SCROLL
        function handleWheel(e: WheelEvent) {
            isTouch.current = false;

            const delta = e.deltaY * wheelSpeed;
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
        isDragging.current = false;
        function handleTouchStart(e: TouchEvent) {
            if (e.touches.length > 1) return;

            isTouch.current = true;
            isFingerDown.current = true;
            isDragging.current = false;

            lastTouchY = e.touches[0].clientY;

            velocityRef.current = 0;
        }

        function handleTouchMove(e: TouchEvent) {
            if (e.touches.length > 1) return;

            const touchY = e.touches[0].clientY;
            const delta = lastTouchY - touchY;

            const direction = Math.sign(delta) as 1 | -1 | 0;

            lastTouchY = touchY;

            // Ignore small movements
            if (Math.abs(delta) < 3) {
                velocityRef.current = 0;
                return;
            }

            isDragging.current = true;

            if (direction !== lastDirectionRef.current) {
                velocityRef.current *= 0.3;
            }

            lastDirectionRef.current = direction;
            velocityRef.current += delta * touchSpeed;
        }

        function handleTouchEnd() {
            isFingerDown.current = false;

            if (!isDragging) {
                velocityRef.current = 0;
            }
        }

        window.addEventListener("wheel", handleWheel);
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

    useFrame((_state, delta) => {
        const touch = isTouch.current;
        const fingerDown = isFingerDown.current;

        // Multiplier for the decay
        const decay = touch
            ? fingerDown
                ? touchMoveDecay
                : touchDecay
            : wheelDecay;

        // const isActive = isTouch.current ? isFingerDown.current : false;
        velocityRef.current *= Math.pow(decay, delta * 60);

        // Ignore small movements
        if (Math.abs(velocityRef.current) < 0.001) {
            velocityRef.current = 0;
        }

        scrollDelta.current = velocityRef.current;
    }, -1);

    return scrollDelta;
}

export default useScroll;
