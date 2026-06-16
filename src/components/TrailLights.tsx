import { useMemo } from 'react';
import * as THREE from 'three';
import { trails, Trail } from '../data/trails';

interface TrailLightsProps {
  activeZones: Record<string, boolean>;
}

function createTrailCurve(points: { x: number; y: number; z: number }[]): THREE.CatmullRomCurve3 {
  const vecs = points.map(p => new THREE.Vector3(p.x, p.y + 0.15, p.z));
  return new THREE.CatmullRomCurve3(vecs, false, 'catmullrom', 0.5);
}

function LightPole({ position, on }: { position: THREE.Vector3; on: boolean }) {
  const poleHeight = 4.5;
  const lightOffset = 0.3;

  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh position={[0, poleHeight / 2, 0]}>
        <cylinderGeometry args={[0.06, 0.1, poleHeight, 6]} />
        <meshStandardMaterial
          color="#2a2a2a"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      <mesh position={[0, poleHeight - 0.25, 0]}>
        <cylinderGeometry args={[0.12, 0.08, 0.3, 6]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      <mesh position={[lightOffset, poleHeight - 0.15, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial
          color={on ? '#fff8e7' : '#333'}
          emissive={on ? '#ffdd88' : '#000'}
          emissiveIntensity={on ? 2 : 0}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[lightOffset, poleHeight - 0.15, 0]}>
        <cylinderGeometry args={[0.3, 0.18, 0.12, 8]} />
        <meshStandardMaterial
          color="#444"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {on && (
        <pointLight
          position={[lightOffset, poleHeight - 0.15, 0]}
          intensity={1.2}
          distance={16}
          decay={2}
          color="#ffdd88"
        />
      )}
    </group>
  );
}

function TrailZoneLights({ trail, on }: { trail: Trail; on: boolean }) {
  const poles = useMemo(() => {
    const curve = createTrailCurve(trail.points);
    const polePositions: THREE.Vector3[] = [];
    const poleSpacing = 0.25;

    let side = 0;
    for (let t = 0.1; t < 0.95; t += poleSpacing) {
      const point = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t).normalize();
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
      const sideOffset = 2.5;

      const pos = point.clone().add(
        normal.clone().multiplyScalar(side % 2 === 0 ? sideOffset : -sideOffset)
      );
      pos.y = point.y + 0.1;
      polePositions.push(pos);
      side++;
    }

    return polePositions;
  }, [trail]);

  return (
    <group>
      {poles.map((pos, idx) => (
        <LightPole key={`${trail.id}-pole-${idx}`} position={pos} on={on} />
      ))}
    </group>
  );
}

export function TrailLights({ activeZones }: TrailLightsProps) {
  return (
    <group>
      {trails.map(trail => (
        <TrailZoneLights
          key={trail.id}
          trail={trail}
          on={activeZones[trail.id] ?? false}
        />
      ))}
    </group>
  );
}
