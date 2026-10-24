import { PerspectiveCamera, View } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, ShaderMaterial, Vector3 } from "three";

const vertexShader = /* glsl */ `
    attribute float aSeed;
    attribute float aSize;
    uniform float uTime;
    uniform float uSize;
    uniform float uPixelRatio;
    varying float vTwinkle;
    void main() {
        vTwinkle = 0.6 + 0.4 * sin(uTime * (1.0 + aSeed * 3.0) + aSeed * 6.28);
        gl_PointSize = aSize * uSize * uPixelRatio * vTwinkle;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`

const fragmentShader = /* glsl */ `
    varying float vTwinkle;
    void main() {
        vec2 uv = gl_PointCoord * 2.0 - 1.0;
        float d = length(uv);
        float rays = 0.04 / (abs(uv.x * uv.y) + 0.04);
        float core = smoothstep(0.35, 0.0, d);
        float star = max(rays * clamp(1.0 - d, 0.0, 1.0), core);
        float alpha = star * vTwinkle;
        if (alpha < 0.01) discard;
        gl_FragColor = vec4(vec3(1.0), alpha);
    }
`

const Stars = ({ count = 3000, radius = 100, size = 1 }: { count?: number; radius?: number; size?: number }) => {
    const dpr = useThree((s) => s.viewport.dpr);

    const uniforms = useMemo(
        () => ({ uTime: { value: 0 }, uSize: { value: size }, uPixelRatio: { value: dpr } }),
        [size, dpr]
    );

    const mat = useRef<ShaderMaterial>(null);

    const [positions, seeds, sizes] = useMemo(() => {
        const p = new Float32Array(count * 3)
        const s = new Float32Array(count)
        const z = new Float32Array(count)
        const v = new Vector3()
        for (let i = 0; i < count; i++) {
            v.randomDirection().multiplyScalar(radius)
            p.set([v.x, v.y, v.z], i * 3)
            s[i] = Math.random()
            z[i] = 4 + Math.pow(Math.random(), 4) * 24 // mostly small, a few big
        }
        return [p, s, z]
    }, [count, radius])

    useFrame(({ clock }) => {
        if (!mat.current) return;
        mat.current.uniforms.uTime.value = clock.elapsedTime * 0.6
    })

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
                <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
            </bufferGeometry>
            <shaderMaterial
                ref={mat}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent
                depthWrite={false}
                blending={AdditiveBlending}
            />
        </points>
    );
}

type StarProps = { count?: number; radius?: number };

const StarrySkyScene = (props: StarProps) => {
    return (
        <View className="starry-sky__scene">
            {/* <color attach="background" args={["#05060f"]} /> */}
            <PerspectiveCamera makeDefault position={[0, 0, 1]} />
            <Stars {...props} />
        </View>
    );
}

export default StarrySkyScene;