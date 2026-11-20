import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import { Camera, Color, Mesh, ShaderMaterial, Vector3 } from "three"

const vertexShader = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime;
uniform vec3 uMoonDir;
uniform vec3 uDeep;
uniform vec3 uHorizon;
uniform vec3 uMoonColor;
uniform float uFadeStart;
uniform float uFadeEnd;
varying vec3 vWorld;

float hash(float n) { return fract(sin(n * 12.9898) * 43758.5453); }

void main() {
  vec3 toFrag = vWorld - cameraPosition;
  float dist = length(toFrag.xz);

  // flat sea, fading into the sky colour toward the far edge
  vec3 col = mix(uDeep, uHorizon, smoothstep(uFadeStart, uFadeEnd, dist));

  // where this pixel is relative to the moon, seen from above
  vec2 dir  = normalize(toFrag.xz);
  vec2 moon = normalize(uMoonDir.xz);
  float side  = dir.x * moon.y - dir.y * moon.x;   // left / right of the moon
  float ahead = dot(dir, moon);                    // in front of us, toward the moon

  // rows of dashes, packed tighter toward the horizon
  float row = log(max(dist, 0.001)) * 22.0;
  float id  = floor(row);
  float f   = fract(row);
  float rnd = hash(id);

  // path is wider up close, thin at the horizon; each dash breathes a little
  float width  = mix(0.07, 0.012, smoothstep(5.0, uFadeEnd, dist));
  float w      = width * (0.35 + 0.9 * rnd) * (0.85 + 0.15 * sin(uTime * 1.2 + id * 1.7));
  float jitter = (hash(id + 7.0) - 0.5) * width * 0.8;

  // position inside this dash: u along the bar, v across it
  float u = (side + jitter) / w;
  float v = (f - 0.5) / 0.22;                      // bar thickness

  // capsule distance (rounded ends)
  float cap = 0.3;                                 // how much of each end is rounded
  float dx  = max(abs(u) - (1.0 - cap), 0.0) / cap;
  float d   = length(vec2(dx, v));

  // defined capsule with a soft, pixel-aware edge
  float aa = max(fwidth(row) / 0.22, fwidth(side) / w) * 1.5;
  float dash = (1.0 - smoothstep(0.75 - aa, 1.0 + aa, d)) * step(0.0, ahead);

  // fade out far rows once they get thinner than a pixel (stops flicker)
  float pixel = fwidth(row);
  dash *= 1.0 - smoothstep(0.3, 0.8, pixel);

  // dashes fade out with the sea near the horizon
  float dashFade = 1.0 - smoothstep(uFadeEnd * 0.7, uFadeEnd, dist);
  col = mix(col, uMoonColor, dash * 0.4 * dashFade);

  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`

type OceanProps = {
  moonDir: Vector3   // world position of the moon (e.g. Moon_Target)
  level?: number
  tilt?: number
  size?: number
}

const _fwd = new Vector3()

const Ocean = ({ moonDir, level = -2, tilt = 0.1, size = 160 }: OceanProps) => {
  const mat = useRef<ShaderMaterial>(null!)

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMoonDir: { value: new Vector3(0, 0, -1) },
    uDeep: { value: new Color('#303b3b') },
    uHorizon: { value: new Color('#161616') },
    uMoonColor: { value: new Color('#5b6a65') },
    uFadeStart: { value: size * 0.06 },
    uFadeEnd: { value: size * 0.47 },
  }), [size])

  useFrame(({ clock }) => {
    mat.current.uniforms.uTime.value = clock.elapsedTime

  })

  const followCamera = (mesh: Mesh, camera: Camera) => {
    // centre under the camera
    mesh.position.set(camera.position.x, level, camera.position.z)

    // turn the tilt to face where the camera looks, so the horizon stays level
    camera.getWorldDirection(_fwd)
    const yaw = Math.atan2(-_fwd.x, -_fwd.z)
    mesh.rotation.set(-Math.PI / 2 + tilt, yaw, 0, 'YXZ')
    mesh.updateMatrixWorld()

    // reflection always points at the real moon from the current camera
    mat.current.uniforms.uMoonDir.value.copy(moonDir)
  }

  return (
    <mesh
      frustumCulled={false}
      onBeforeRender={function (this: Mesh, _renderer, _scene, camera) {
        followCamera(this, camera)
      }}
    >
      <planeGeometry args={[size, size]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  )
}

export default Ocean