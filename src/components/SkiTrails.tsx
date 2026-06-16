import { useMemo, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { trails, Trail, difficultyColor } from '../data/trails';

interface SkiTrailsProps {
  highlightedTrail: string | null;
  onTrailClick: (trail: Trail) => void;
  activeZones: Record<string, boolean>;
}

function createTrailCurve(points: { x: number; y: number; z: number }[]): THREE.CatmullRomCurve3 {
  const vecs = points.map(p => new THREE.Vector3(p.x, p.y + 0.15, p.z));
  return new THREE.CatmullRomCurve3(vecs, false, 'catmullrom', 0.5);
}

function darkenColor(hex: string, factor: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const dr = Math.floor(r * factor);
  const dg = Math.floor(g * factor);
  const db = Math.floor(b * factor);
  return `#${dr.toString(16).padStart(2, '0')}${dg.toString(16).padStart(2, '0')}${db.toString(16).padStart(2, '0')}`;
}

function SingleTrail({
  trail,
  highlighted,
  onClick,
  lightsOn,
}: {
  trail: Trail;
  highlighted: boolean;
  onClick: (trail: Trail) => void;
  lightsOn: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const { tubeGeo, linePoints } = useMemo(() => {
    const curve = createTrailCurve(trail.points);
    const tubeGeo = new THREE.TubeGeometry(curve, 64, highlighted ? 0.18 : 0.12, 8, false);
    const linePoints = curve.getPoints(100);
    return { tubeGeo, linePoints };
  }, [trail, highlighted]);

  const baseColor = useMemo(() => {
    if (trail.status === 'closed') return '#666666';
    return difficultyColor[trail.difficulty];
  }, [trail]);

  const trailColor = useMemo(() => {
    if (!lightsOn) return darkenColor(baseColor, 0.25);
    return baseColor;
  }, [baseColor, lightsOn]);

  const emissiveIntensity = useMemo(() => {
    if (highlighted) return lightsOn ? 0.7 : 0.3;
    return lightsOn ? 0.18 : 0.02;
  }, [highlighted, lightsOn]);

  const markerEmissiveIntensity = useMemo(() => {
    if (highlighted) return lightsOn ? 0.9 : 0.4;
    return lightsOn ? 0.25 : 0.04;
  }, [highlighted, lightsOn]);

  const lineOpacity = useMemo(() => {
    return lightsOn ? 0.7 : 0.15;
  }, [lightsOn]);

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
          color={trailColor}
          emissive={lightsOn ? baseColor : darkenColor(baseColor, 0.3)}
          emissiveIntensity={emissiveIntensity}
          roughness={lightsOn ? 0.4 : 0.6}
          metalness={lightsOn ? 0.2 : 0.1}
          transparent={trail.status === 'closed'}
          opacity={trail.status === 'closed' ? 0.5 : 1}
        />
      </mesh>

      {/* Glow for highlighted trail */}
      {highlighted && lightsOn && (
        <mesh geometry={tubeGeo}>
          <meshBasicMaterial
            color={baseColor}
            transparent
            opacity={0.25}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Trail markers at curves */}
      {trail.points.map((p, idx) => (
        <mesh key={idx} position={[p.x, p.y + 0.2, p.z]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial
            color={trailColor}
            emissive={lightsOn ? baseColor : darkenColor(baseColor, 0.3)}
            emissiveIntensity={markerEmissiveIntensity}
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
          color={trailColor}
          dashSize={0.3}
          gapSize={0.15}
          transparent
          opacity={lineOpacity}
        />
      </line>
    </group>
  );
}

export function SkiTrails({ highlightedTrail, onTrailClick, activeZones }: SkiTrailsProps) {
  return (
    <group>
      {trails.map(trail => (
        <SingleTrail
          key={trail.id}
          trail={trail}
          highlighted={highlightedTrail === trail.id}
          onClick={onTrailClick}
          lightsOn={activeZones[trail.id] ?? false}
        />
      ))}
    </group>
  );
}
