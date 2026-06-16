import { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Mountain } from './components/Mountain';
import { SkiTrails } from './components/SkiTrails';
import { Trees } from './components/Trees';
import { Buildings } from './components/Buildings';
import { Snowfall } from './components/Snowfall';
import { LiftLines } from './components/LiftLines';
import { WeatherPanel } from './components/WeatherPanel';
import { LiftPanel } from './components/LiftPanel';
import { TrailInfoCard } from './components/TrailInfoCard';
import { BottomBar } from './components/BottomBar';
import { FPVController } from './components/FPVController';
import { TrailLights } from './components/TrailLights';
import { LightPanel } from './components/LightPanel';
import { trails, Trail } from './data/trails';

export default function App() {
  const [selectedTrail, setSelectedTrail] = useState<Trail | null>(null);
  const [highlightedTrail, setHighlightedTrail] = useState<string | null>(null);
  const [fpvActive, setFpvActive] = useState(false);
  const [fpvTrailId, setFpvTrailId] = useState<string | null>(null);
  const [fpvProgress, setFpvProgress] = useState(0);
  const [activeZones, setActiveZones] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    trails.forEach(t => { initial[t.id] = true; });
    return initial;
  });

  const handleTrailClick = useCallback((trail: Trail) => {
    if (fpvActive) return;
    setSelectedTrail(trail);
    setHighlightedTrail(trail.id);
  }, [fpvActive]);

  const handleCloseCard = useCallback(() => {
    setSelectedTrail(null);
    setHighlightedTrail(null);
  }, []);

  const handleStartFPV = useCallback((trailId: string) => {
    setFpvActive(true);
    setFpvTrailId(trailId);
    setFpvProgress(0);
    setSelectedTrail(null);
    setHighlightedTrail(trailId);
  }, []);

  const handleStopFPV = useCallback(() => {
    setFpvActive(false);
    setFpvTrailId(null);
    setFpvProgress(0);
  }, []);

  const handleToggleLight = useCallback((trailId: string) => {
    setActiveZones(prev => ({ ...prev, [trailId]: !prev[trailId] }));
  }, []);

  const handleToggleAllLights = useCallback((on: boolean) => {
    setActiveZones(() => {
      const next: Record<string, boolean> = {};
      trails.forEach(t => { next[t.id] = on; });
      return next;
    });
  }, []);

  const fpvTrail = fpvTrailId ? trails.find(t => t.id === fpvTrailId) ?? null : null;

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [30, 25, 30], fov: 50, near: 0.1, far: 500 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.45 }}
      >
        <color attach="background" args={['#0a1628']} />
        <fog attach="fog" args={['#0a1628', 60, 120]} />

        <ambientLight intensity={0.06} color="#6688aa" />
        <directionalLight
          position={[30, 40, 20]}
          intensity={0.12}
          color="#aabbdd"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={100}
          shadow-camera-left={-40}
          shadow-camera-right={40}
          shadow-camera-top={40}
          shadow-camera-bottom={-40}
        />
        <pointLight position={[-20, 30, -10]} intensity={0.06} color="#6699cc" />
        <hemisphereLight args={['#446688', '#223344', 0.1]} />

        <Sky
          distance={450}
          sunPosition={[100, -30, 50]}
          inclination={0.8}
          azimuth={0.75}
          turbidity={10}
          rayleigh={0.5}
          mieCoefficient={0.005}
          mieDirectionalG={0.8}
        />
        <Stars radius={200} depth={80} count={5000} factor={6} fade speed={0.5} />

        <Mountain />
        <Trees />
        <Buildings />
        <SkiTrails
          highlightedTrail={highlightedTrail}
          onTrailClick={handleTrailClick}
        />
        <TrailLights activeZones={activeZones} />
        <LiftLines />
        <Snowfall />

        {fpvActive && fpvTrail && (
          <FPVController
            trail={fpvTrail}
            progress={fpvProgress}
            onProgressUpdate={setFpvProgress}
          />
        )}

        <OrbitControls
          enabled={!fpvActive}
          enablePan={true}
          enableDamping={true}
          dampingFactor={0.05}
          minPolarAngle={0.1}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={10}
          maxDistance={80}
          target={[0, 6, -4]}
        />
      </Canvas>

      <WeatherPanel />
      <LiftPanel />
      <LightPanel
        activeZones={activeZones}
        onToggle={handleToggleLight}
        onToggleAll={handleToggleAllLights}
      />
      {selectedTrail && (
        <TrailInfoCard
          trail={selectedTrail}
          onClose={handleCloseCard}
          onStartFPV={handleStartFPV}
        />
      )}
      <div className="legend">
        <div className="legend-item">
          <div className="legend-line green" />
          <span>初级道</span>
        </div>
        <div className="legend-item">
          <div className="legend-line blue" />
          <span>中级道</span>
        </div>
        <div className="legend-item">
          <div className="legend-line black" />
          <span>高级道</span>
        </div>
      </div>
      <BottomBar
        fpvActive={fpvActive}
        fpvTrailId={fpvTrailId}
        onStartFPV={handleStartFPV}
        onStopFPV={handleStopFPV}
      />
      {fpvActive && fpvTrail && (
        <div className="fp-hud">
          <div>
            <span>雪道</span>
            <br />
            {fpvTrail.name}
          </div>
          <div>
            <span>进度</span>
            <br />
            {Math.round(fpvProgress * 100)}%
          </div>
          <div>
            <span>当前坡度</span>
            <br />
            {Math.round(fpvTrail.avgSlope + (fpvTrail.maxSlope - fpvTrail.avgSlope) * Math.sin(fpvProgress * Math.PI))}%
          </div>
          <div>
            <span>海拔</span>
            <br />
            {Math.round(3200 - (3200 - 1800) * fpvProgress)}m
          </div>
        </div>
      )}
    </>
  );
}
