import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { AdditiveBlending, Points, Vector3 } from "three";

const vertexShader = /* glsl */ `
    attribute float aSeed;
    attribute float aSize;
    uniform float uSize;
    uniform float uPixelRatio;
    varying float vBrightness;
    varying vec3 vTint;
    void main() {
        vBrightness = 0.4 + 0.6 * aSeed;

        // subtle per-star tint: cool blue-white to warm white
        vec3 tint = mix(vec3(0.78, 0.86, 1.0), vec3(1.0, 0.9, 0.78), fract(aSeed * 7.31));
        vTint = mix(vec3(1.0), tint, 0.6);

        gl_PointSize = aSize * uSize * uPixelRatio;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`

const fragmentShader = /* glsl */ `
    varying float vBrightness;
    varying vec3 vTint;
    void main() {
        vec2 uv = gl_PointCoord * 2.0 - 1.0;
        float d = length(uv);
        float rays = 0.04 / (abs(uv.x * uv.y) + 0.04);
        float core = 1.0 - smoothstep(0.0, 0.35, d);
        float star = max(rays * clamp(1.0 - d, 0.0, 1.0), core);
        gl_FragColor = vec4(vTint, star * vBrightness);
    }
`

type StarsProps = {
    count?: number;
    radius?: number;
    size?: number;
};

const Stars = ({ count = 3000, radius = 100, size = 1 }: StarsProps) => {
    const dpr = useThree((s) => s.viewport.dpr);

    const uniforms = useMemo(
        () => ({ uSize: { value: size }, uPixelRatio: { value: dpr } }),
        [size, dpr]
    );

    const [positions, seeds, sizes] = useMemo(() => {
        const p = new Float32Array(count * 3);
        const s = new Float32Array(count);
        const z = new Float32Array(count);
        const v = new Vector3();

        for (let i = 0; i < count; i++) {
            v.randomDirection();
            v.y = Math.abs(v.y); // upper half only; the ocean hides the rest
            v.multiplyScalar(radius);
            p.set([v.x, v.y, v.z], i * 3);

            s[i] = Math.random();
            // mostly small stars, a few big ones with visible rays
            z[i] = 2.5 + Math.pow(Math.random(), 6) * 14;
        }
        return [p, s, z];
    }, [count, radius]);

    return (
        <points
            frustumCulled={false}
            onBeforeRender={function (this: Points, _r, _s, camera) {
                this.position.copy(camera.position);
                this.updateMatrixWorld();
            }}
        >
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
                <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
            </bufferGeometry>
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent
                depthWrite={false}
                blending={AdditiveBlending}
            />
        </points>
    );
};

export default Stars;