import { useMemo } from 'react';

interface Building {
  position: [number, number, number];
  width: number;
  height: number;
  depth: number;
  color: string;
  roofColor: string;
}

export function Buildings() {
  const buildings = useMemo<Building[]>(() => [
    // Base lodge
    { position: [5, 0.5, 8], width: 3, height: 2, depth: 2, color: '#8B7355', roofColor: '#5a3a28' },
    { position: [5, 0.5, 5.5], width: 2, height: 1.5, depth: 1.5, color: '#9B8B70', roofColor: '#5a3a28' },
    // Mid-mountain hut
    { position: [-8, 6.5, -8], width: 1.5, height: 1.2, depth: 1.2, color: '#A0522D', roofColor: '#6B3410' },
    // Restaurant
    { position: [12, 1, 5], width: 2.5, height: 1.8, depth: 2, color: '#C4A882', roofColor: '#5a3a28' },
    // Small huts
    { position: [-3, 0.4, 6], width: 1.2, height: 1, depth: 1, color: '#8B6914', roofColor: '#5a3a28' },
    { position: [8, 0.4, 7], width: 1, height: 0.8, depth: 1, color: '#A0926B', roofColor: '#5a3a28' },
    // Equipment shed
    { position: [-6, 0.3, 8], width: 1.8, height: 1, depth: 1.5, color: '#708090', roofColor: '#4a5568' },
  ], []);

  return (
    <group>
      {buildings.map((b, i) => (
        <group key={i} position={b.position}>
          {/* Building body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[b.width, b.height, b.depth]} />
            <meshStandardMaterial color={b.color} roughness={0.8} />
          </mesh>
          {/* Roof */}
          <mesh position={[0, b.height / 2 + 0.3, 0]} castShadow>
            <coneGeometry args={[Math.max(b.width, b.depth) * 0.75, 0.6, 4]} />
            <meshStandardMaterial color={b.roofColor} roughness={0.7} />
          </mesh>
          {/* Windows */}
          {b.height > 1 && (
            <>
              <mesh position={[0, 0.1, b.depth / 2 + 0.01]}>
                <planeGeometry args={[b.width * 0.3, b.height * 0.25]} />
                <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.3} />
              </mesh>
            </>
          )}
        </group>
      ))}
    </group>
  );
}
