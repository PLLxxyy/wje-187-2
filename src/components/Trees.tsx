import { useMemo } from 'react';
import * as THREE from 'three';

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
  return (n00 * (1 - sx) + n10 * sx) * (1 - sy) + (n01 * (1 - sx) + n11 * sx) * sy;
}

function fbm(x: number, y: number): number {
  return smoothNoise(x, y) * 0.6 + smoothNoise(x * 2, y * 2) * 0.3 + smoothNoise(x * 4, y * 4) * 0.1;
}

function mountainHeight(x: number, z: number): number {
  const dist = Math.sqrt(x * x + z * z);
  const peakHeight = 20 * Math.exp(-dist * dist / 180);
  const ridgeHeight = 8 * Math.exp(-(x * x) / 50) * Math.exp(-((z + 5) * (z + 5)) / 200);
  const noiseVal = (smoothNoise(x * 0.08, z * 0.08) * 0.6 + smoothNoise(x * 0.16, z * 0.16) * 0.3 + smoothNoise(x * 0.32, z * 0.32) * 0.1) * 5;
  const edgeFalloff = Math.max(0, 1 - dist / 30);
  return peakHeight + ridgeHeight + noiseVal + edgeFalloff * 2;
}

interface TreeInstance {
  position: [number, number, number];
  scale: number;
  color: string;
}

export function Trees() {
  const trees = useMemo<TreeInstance[]>(() => {
    const result: TreeInstance[] = [];
    const rng = (seed: number) => {
      let s = seed;
      return () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
      };
    };
    const rand = rng(42);

    for (let i = 0; i < 300; i++) {
      const x = (rand() - 0.5) * 50;
      const z = (rand() - 0.5) * 50 - 5;
      const h = mountainHeight(x, z);

      // Trees only in forest zone
      if (h > 2 && h < 10) {
        const dist = Math.sqrt(x * x + (z + 5) * (z + 5));
        // Avoid trail areas roughly
        const nearTrail = false; // Could check trail proximity

        if (!nearTrail) {
          const scale = 0.5 + rand() * 0.8;
          const greenVariant = rand();
          const color = greenVariant > 0.5 ? '#1a4a2a' : greenVariant > 0.25 ? '#1d5530' : '#164020';
          result.push({ position: [x, h, z], scale, color });
        }
      }
    }
    return result;
  }, []);

  return (
    <group>
      {trees.map((tree, i) => (
        <group key={i} position={tree.position} scale={tree.scale}>
          {/* Trunk */}
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.08, 0.8, 6]} />
            <meshStandardMaterial color="#3d2817" roughness={0.9} />
          </mesh>
          {/* Canopy layers */}
          <mesh position={[0, 1.1, 0]} castShadow>
            <coneGeometry args={[0.5, 1.0, 6]} />
            <meshStandardMaterial color={tree.color} roughness={0.8} />
          </mesh>
          <mesh position={[0, 1.5, 0]} castShadow>
            <coneGeometry args={[0.38, 0.7, 6]} />
            <meshStandardMaterial color={tree.color} roughness={0.8} />
          </mesh>
          <mesh position={[0, 1.8, 0]} castShadow>
            <coneGeometry args={[0.25, 0.5, 6]} />
            <meshStandardMaterial color={tree.color} roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
