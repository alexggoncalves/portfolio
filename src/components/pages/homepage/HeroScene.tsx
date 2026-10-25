import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";

function HeroScene() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(true);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div className="hero__scene">
            <Canvas
                camera={{ position: [0, 0, 5] }}
                dpr={[1, 1.5]}
                frameloop={inView ? "always" : "never"}
            >
                <ambientLight />
                <mesh>
                    <boxGeometry />
                    <meshStandardMaterial />
                </mesh>
            </Canvas>
        </div>
    );
}

export default HeroScene;
