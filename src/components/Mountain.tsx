import { useMemo, useRef } from 'react';
import * as THREE from 'three';

// Simple noise function for terrain generation
function noise2D(x: number, y: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

function smoothNoise(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;

  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);

  const n00 = noise2D(ix, iy);
  const n10 = noise2D(ix + 1, iy);
  const n01 = noise2D(ix, iy + 1);
  const n11 = noise2D(ix + 1, iy + 1);

  const nx0 = n00 * (1 - sx) + n10 * sx;
  const nx1 = n01 * (1 - sx) + n11 * sx;

  return nx0 * (1 - sy) + nx1 * sy;
}

function fbm(x: number, y: number, octaves: number = 4): number {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxValue = 0;

  for (let i = 0; i < octaves; i++) {
    value += amplitude * smoothNoise(x * frequency, y * frequency);
    maxValue += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return value / maxValue;
}

function mountainHeight(x: number, z: number): number {
  // Central peak
  const dist = Math.sqrt(x * x + z * z);
  const peakHeight = 20 * Math.exp(-dist * dist / 180);

  // Ridge along z-axis
  const ridgeHeight = 8 * Math.exp(-(x * x) / 50) * Math.exp(-((z + 5) * (z + 5)) / 200);

  // Noise for natural variation
  const noiseVal = fbm(x * 0.08, z * 0.08, 5) * 5;

  // Slope down to edges
  const edgeFalloff = Math.max(0, 1 - dist / 30);
  const baseHeight = edgeFalloff * 2;

  return peakHeight + ridgeHeight + noiseVal + baseHeight;
}

export function Mountain() {
  const meshRef = useRef<THREE.Mesh>(null);

  const { geometry, snowGeometry } = useMemo(() => {
    const size = 60;
    const segments = 128;
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const h = mountainHeight(x, z);
      pos.setY(i, h);

      // Vertex colors for terrain
      const snowLine = 14;
      const treeLine = 8;

      let r: number, g: number, b: number;

      if (h > snowLine) {
        // Snow
        const snowFactor = Math.min((h - snowLine) / 6, 1);
        r = 0.85 + snowFactor * 0.1;
        g = 0.88 + snowFactor * 0.1;
        b = 0.92 + snowFactor * 0.08;
      } else if (h > treeLine) {
        // Rocky / transition
        const t = (h - treeLine) / (snowLine - treeLine);
        r = 0.35 + t * 0.5;
        g = 0.38 + t * 0.5;
        b = 0.4 + t * 0.5;
      } else if (h > 3) {
        // Forest green
        const n = fbm(x * 0.2, z * 0.2, 3);
        r = 0.1 + n * 0.15;
        g = 0.25 + n * 0.2;
        b = 0.1 + n * 0.1;
      } else {
        // Base / valley
        const n = fbm(x * 0.15, z * 0.15, 2);
        r = 0.2 + n * 0.1;
        g = 0.3 + n * 0.15;
        b = 0.15 + n * 0.08;
      }

      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();

    // Snow overlay geometry - slightly elevated for snow areas
    const snowGeo = new THREE.PlaneGeometry(size, size, segments, segments);
    snowGeo.rotateX(-Math.PI / 2);

    const snowPos = snowGeo.attributes.position;
    for (let i = 0; i < snowPos.count; i++) {
      const x = snowPos.getX(i);
      const z = snowPos.getZ(i);
      const h = mountainHeight(x, z);
      snowPos.setY(i, h > 14 ? h + 0.05 : -100);
    }
    snowGeo.computeVertexNormals();

    return { geometry: geo, snowGeometry: snowGeo };
  }, []);

  return (
    <group>
      {/* Main terrain */}
      <mesh ref={meshRef} geometry={geometry} receiveShadow castShadow>
        <meshStandardMaterial
          vertexColors
          roughness={0.85}
          metalness={0.05}
          flatShading={false}
        />
      </mesh>

      {/* Snow overlay */}
      <mesh geometry={snowGeometry} receiveShadow>
        <meshStandardMaterial
          color="#e8f0f8"
          roughness={0.3}
          metalness={0.1}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Ground plane at base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#c8d8e8" roughness={0.9} />
      </mesh>
    </group>
  );
}
