import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Trail } from '../data/trails';

interface FPVControllerProps {
  trail: Trail;
  progress: number;
  onProgressUpdate: (p: number) => void;
}

export function FPVController({ trail, progress, onProgressUpdate }: FPVControllerProps) {
  const { camera } = useThree();
  const progressRef = useRef(progress);
  const targetRef = useRef(new THREE.Vector3());
  const speed = 0.0008; // Controls animation speed

  // Build spline from trail points
  const curve = useRef<THREE.CatmullRomCurve3>(null);
  useEffect(() => {
    const vecs = trail.points.map(p => new THREE.Vector3(p.x, p.y + 0.8, p.z));
    curve.current = new THREE.CatmullRomCurve3(vecs, false, 'catmullrom', 0.5);
    progressRef.current = 0;
  }, [trail]);

  useFrame((_, delta) => {
    if (!curve.current) return;

    progressRef.current += delta * speed * 2;
    if (progressRef.current > 1) progressRef.current = 0;

    const t = progressRef.current;
    const pos = curve.current.getPoint(t);
    const lookAhead = curve.current.getPoint(Math.min(t + 0.03, 1));

    // Smooth camera position
    camera.position.lerp(pos, 0.15);
    targetRef.current.lerp(lookAhead, 0.15);
    camera.lookAt(targetRef.current);

    // Slight tilt for skiing feel
    const tangent = curve.current.getTangent(t);
    const up = new THREE.Vector3(0, 1, 0);
    const right = new THREE.Vector3().crossVectors(tangent, up).normalize();
    camera.up.lerp(
      new THREE.Vector3()
        .addScaledVector(up, 0.9)
        .addScaledVector(right, 0.1 * Math.sin(t * Math.PI * 6))
        .normalize(),
      0.1
    );

    onProgressUpdate(progressRef.current);
  });

  return null;
}
