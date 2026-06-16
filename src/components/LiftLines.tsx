import { useMemo } from 'react';
import * as THREE from 'three';
import { lifts } from '../data/lifts';

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

function mountainHeight(x: number, z: number): number {
  const dist = Math.sqrt(x * x + z * z);
  const peakHeight = 20 * Math.exp(-dist * dist / 180);
  const ridgeHeight = 8 * Math.exp(-(x * x) / 50) * Math.exp(-((z + 5) * (z + 5)) / 200);
  const noiseVal = (smoothNoise(x * 0.08, z * 0.08) * 0.6 + smoothNoise(x * 0.16, z * 0.16) * 0.3) * 5;
  const edgeFalloff = Math.max(0, 1 - dist / 30);
  return peakHeight + ridgeHeight + noiseVal + edgeFalloff * 2;
}

interface LiftDef {
  bottom: [number, number];
  top: [number, number];
  color: string;
}

const liftPositions: LiftDef[] = [
  { bottom: [8, 10], top: [6, -10], color: '#ff6b35' },
  { bottom: [3, 9], top: [4, -8], color: '#ffcc02' },
  { bottom: [13, 8], top: [10, -12], color: '#ff6b35' },
  { bottom: [-5, 8], top: [-4, -14], color: '#e74c3c' },
  { bottom: [-2, 7], top: [0, -4], color: '#2ecc71' },
  { bottom: [15, 7], top: [13, -14], color: '#e74c3c' },
];

export function LiftLines() {
  const lines = useMemo(() => {
    return liftPositions.map((ld, idx) => {
      const bx = ld.bottom[0];
      const bz = ld.bottom[1];
      const tx = ld.top[0];
      const tz = ld.top[1];
      const by = mountainHeight(bx, bz) + 0.5;
      const ty = mountainHeight(tx, tz) + 0.5;

      // Catenary curve for cable sag
      const mid = [(bx + tx) / 2, Math.max(by, ty) + 1.5, (bz + tz) / 2];
      const points = [];
      const steps = 30;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = bx + (tx - bx) * t;
        const z = bz + (tz - bz) * t;
        // Sag parabola
        const sag = -3 * t * (1 - t);
        const y = by + (ty - by) * t + sag + Math.max(by, ty) + 1.5 - Math.max(by, ty);
        points.push(new THREE.Vector3(x, y, z));
      }

      return { points, color: ld.color, idx, lift: lifts[idx] };
    });
  }, []);

  return (
    <group>
      {lines.map((line) => {
        const curve = new THREE.CatmullRomCurve3(line.points, false, 'catmullrom', 0.3);
        const tubeGeo = new THREE.TubeGeometry(curve, 40, 0.04, 6, false);
        const isRunning = line.lift?.status === 'running';
        const color = isRunning ? line.color : '#555555';

        return (
          <group key={line.idx}>
            {/* Cable */}
            <mesh geometry={tubeGeo}>
              <meshStandardMaterial
                color={color}
                emissive={isRunning ? color : '#000'}
                emissiveIntensity={isRunning ? 0.3 : 0}
              />
            </mesh>

            {/* Tower pylons */}
            {[0.25, 0.5, 0.75].map((t, pi) => {
              const pt = curve.getPoint(t);
              return (
                <group key={pi} position={[pt.x, 0, pt.z]}>
                  <mesh position={[0, pt.y / 2, 0]}>
                    <cylinderGeometry args={[0.08, 0.12, pt.y, 6]} />
                    <meshStandardMaterial color="#888888" roughness={0.6} metalness={0.4} />
                  </mesh>
                  <mesh position={[0, pt.y, 0]}>
                    <boxGeometry args={[0.3, 0.08, 0.08]} />
                    <meshStandardMaterial color="#666666" />
                  </mesh>
                </group>
              );
            })}

            {/* Station markers */}
            <mesh position={[line.points[0].x, line.points[0].y, line.points[0].z]}>
              <boxGeometry args={[0.4, 0.3, 0.4]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[line.points[line.points.length - 1].x, line.points[line.points.length - 1].y, line.points[line.points.length - 1].z]}>
              <boxGeometry args={[0.4, 0.3, 0.4]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
