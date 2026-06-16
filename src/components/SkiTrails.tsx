import { useMemo, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { trails, Trail, difficultyColor } from '../data/trails';

interface SkiTrailsProps {
  highlightedTrail: string | null;
  onTrailClick: (trail: Trail) => void;
}

function createTrailCurve(points: { x: number; y: number; z: number }[]): THREE.CatmullRomCurve3 {
  const vecs = points.map(p => new THREE.Vector3(p.x, p.y + 0.15, p.z));
  return new THREE.CatmullRomCurve3(vecs, false, 'catmullrom', 0.5);
}

function SingleTrail({
  trail,
  highlighted,
  onClick,
}: {
  trail: Trail;
  highlighted: boolean;
  onClick: (trail: Trail) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const { tubeGeo, linePoints } = useMemo(() => {
    const curve = createTrailCurve(trail.points);
    const tubeGeo = new THREE.TubeGeometry(curve, 64, highlighted ? 0.18 : 0.12, 8, false);
    const linePoints = curve.getPoints(100);
    return { tubeGeo, linePoints };
  }, [trail, highlighted]);

  const color = useMemo(() => {
    if (trail.status === 'closed') return '#666666';
    return difficultyColor[trail.difficulty];
  }, [trail]);

  const handleClick = useCallback((e: any) => {
    e.stopPropagation();
    onClick(trail);
  }, [trail, onClick]);

  return (
    <group>
      {/* Main tube */}
      <mesh
        ref={meshRef}
        geometry={tubeGeo}
        onClick={handleClick}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'default'; }}
      >
        <meshStandardMaterial
          color={color}
          emissive={highlighted ? color : '#000000'}
          emissiveIntensity={highlighted ? 0.5 : 0}
          roughness={0.4}
          metalness={0.2}
          transparent={trail.status === 'closed'}
          opacity={trail.status === 'closed' ? 0.5 : 1}
        />
      </mesh>

      {/* Glow for highlighted trail */}
      {highlighted && (
        <mesh geometry={tubeGeo}>
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.2}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Trail markers at curves */}
      {trail.points.map((p, idx) => (
        <mesh key={idx} position={[p.x, p.y + 0.2, p.z]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={highlighted ? 0.6 : 0.15}
          />
        </mesh>
      ))}

      {/* Dashed center line for visibility */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePoints.length}
            array={new Float32Array(linePoints.flatMap(p => [p.x, p.y + 0.02, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineDashedMaterial
          color={color}
          dashSize={0.3}
          gapSize={0.15}
          transparent
          opacity={0.6}
        />
      </line>
    </group>
  );
}

export function SkiTrails({ highlightedTrail, onTrailClick }: SkiTrailsProps) {
  return (
    <group>
      {trails.map(trail => (
        <SingleTrail
          key={trail.id}
          trail={trail}
          highlighted={highlightedTrail === trail.id}
          onClick={onTrailClick}
        />
      ))}
    </group>
  );
}
