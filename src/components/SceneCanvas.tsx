import { Canvas } from "@react-three/fiber";

import PostProcessing from "./Postprocessing/Postprocessing";

function SceneCanvas({ children }: { children?: React.ReactNode }) {
    return (
        <div className="canvas-container">
            <Canvas
                shadows
                dpr={[1, 1.5]}
                camera={{ position: [-5, 0, 5.5], fov: 45, near: 1, far: 20 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                }}
                flat
            >
                {children}
                <PostProcessing />
            </Canvas>
        </div>
    );
}

export default SceneCanvas;
