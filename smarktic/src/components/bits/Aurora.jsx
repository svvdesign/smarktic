import { useEffect, useRef } from 'react'
import { Mesh, Program, Renderer, Triangle } from 'ogl'

const vertex = /* glsl */ `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`

const fragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float t = uTime * 0.12;

  float n1 = snoise(vec2(uv.x * 1.4 + t, t * 0.7));
  float n2 = snoise(vec2(uv.x * 2.3 - t * 1.3, t * 0.5 + 3.0));
  float n3 = snoise(vec2(uv.x * 0.9 + t * 0.6, t * 0.4 + 7.0));

  float band1 = exp(-abs(uv.y - (0.66 + 0.16 * n1 + 0.06 * n2)) * 7.0);
  float band2 = exp(-abs(uv.y - (0.48 + 0.14 * n3 - 0.05 * n1)) * 9.0) * 0.55;

  vec3 col = mix(uC1, uC2, smoothstep(0.0, 1.0, uv.x + 0.35 * n2));
  col = mix(col, uC3, smoothstep(0.2, 1.0, n3 * 0.5 + 0.5) * 0.7);

  float mouse = 1.0 - smoothstep(0.0, 0.4, distance(uv, uMouse));
  float intensity = band1 + band2 + mouse * 0.35 * (band1 + 0.3);
  intensity *= smoothstep(0.05, 0.55, uv.y);
  intensity = clamp(intensity, 0.0, 1.0);

  gl_FragColor = vec4(col * intensity, intensity);
}
`

const hexToRgb = (hex) => {
  const n = parseInt(hex.replace('#', ''), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

export default function Aurora({ colors = ['#1d4ed8', '#22d3ee', '#8b5cf6'], className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const container = ref.current
    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 1.5),
    })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    gl.canvas.style.width = '100%'
    gl.canvas.style.height = '100%'
    gl.canvas.style.display = 'block'
    container.appendChild(gl.canvas)

    const program = new Program(gl, {
      vertex,
      fragment,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uRes: { value: [1, 1] },
        uMouse: { value: [0.5, 0.6] },
        uC1: { value: hexToRgb(colors[0]) },
        uC2: { value: hexToRgb(colors[1]) },
        uC3: { value: hexToRgb(colors[2]) },
      },
    })
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

    const resize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight)
      program.uniforms.uRes.value = [gl.canvas.width, gl.canvas.height]
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)

    const mouse = [0.5, 0.6]
    const target = [0.5, 0.6]
    const onMove = (e) => {
      const r = container.getBoundingClientRect()
      target[0] = (e.clientX - r.left) / r.width
      target[1] = 1 - (e.clientY - r.top) / r.height
    }
    window.addEventListener('pointermove', onMove)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let visible = true
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    io.observe(container)

    let raf
    const start = performance.now()
    const loop = (now) => {
      raf = requestAnimationFrame(loop)
      if (!visible) return
      mouse[0] += (target[0] - mouse[0]) * 0.05
      mouse[1] += (target[1] - mouse[1]) * 0.05
      program.uniforms.uMouse.value = mouse
      program.uniforms.uTime.value = reduced ? 8 : (now - start) / 1000
      renderer.render({ scene: mesh })
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      gl.canvas.remove()
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
    // Colors are fixed per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={ref} className={`aurora ${className}`} aria-hidden="true" />
}
