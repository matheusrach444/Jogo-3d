import React from 'react';

interface WorldProps {
  currentArea: 'ruins' | 'forest' | 'temple';
}

export const World: React.FC<WorldProps> = ({ currentArea }) => {
  return (
    <group>
      {/* Sky / Fragmented Sun */}
      <mesh position={[0, 50, -80]}>
        <sphereGeometry args={[15, 32, 32]} />
        <meshBasicMaterial 
          color="#ff6b35"
          emissive="#ff6b35"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Ambient Light */}
      <ambientLight intensity={0.4} color="#ffa726" />
      <directionalLight
        position={[10, 30, 10]}
        intensity={1.5}
        color="#ffb74d"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />

      {/* Ground - Central Platform */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[20, 20, 1, 32]} />
        <meshStandardMaterial 
          color="#37474f"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* RUINS AREA - Ancient Structures */}
      <group position={[-25, 0, 0]}>
        {/* Ruins Platform */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[15, 1, 15]} />
          <meshStandardMaterial color="#5d4037" roughness={0.9} />
        </mesh>

        {/* Broken Pillars */}
        {[0, 1, 2, 3].map((i) => {
          const angle = (i / 4) * Math.PI * 2;
          const radius = 5;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * radius, 2, Math.sin(angle) * radius]}
              castShadow
            >
              <cylinderGeometry args={[0.5, 0.6, 4, 8]} />
              <meshStandardMaterial color="#8d6e63" roughness={0.8} />
            </mesh>
          );
        })}

        {/* Ruins Walls */}
        <mesh position={[0, 1.5, -7]} castShadow>
          <boxGeometry args={[10, 3, 1]} />
          <meshStandardMaterial color="#6d4c41" roughness={0.9} />
        </mesh>
      </group>

      {/* FOREST AREA - Suspended Trees */}
      <group position={[25, 0, 0]}>
        {/* Forest Platform */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[15, 1, 15]} />
          <meshStandardMaterial color="#2e7d32" roughness={0.8} />
        </mesh>

        {/* Floating Trees */}
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (i / 5) * Math.PI * 2;
          const radius = 4;
          return (
            <group
              key={i}
              position={[Math.cos(angle) * radius, 2, Math.sin(angle) * radius]}
            >
              {/* Trunk */}
              <mesh castShadow>
                <cylinderGeometry args={[0.3, 0.4, 3, 8]} />
                <meshStandardMaterial color="#4e342e" />
              </mesh>
              {/* Leaves */}
              <mesh position={[0, 2.5, 0]} castShadow>
                <coneGeometry args={[1.5, 3, 8]} />
                <meshStandardMaterial 
                  color="#66bb6a"
                  emissive="#43a047"
                  emissiveIntensity={0.2}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* TEMPLE AREA - Light Temple */}
      <group position={[0, 0, 25]}>
        {/* Temple Platform */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[15, 1, 15]} />
          <meshStandardMaterial 
            color="#ffd54f"
            emissive="#ffb300"
            emissiveIntensity={0.2}
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>

        {/* Temple Structure */}
        <mesh position={[0, 3, 0]} castShadow>
          <boxGeometry args={[8, 6, 8]} />
          <meshStandardMaterial 
            color="#ffca28"
            emissive="#ffa000"
            emissiveIntensity={0.3}
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>

        {/* Temple Roof */}
        <mesh position={[0, 6.5, 0]} castShadow>
          <coneGeometry args={[6, 2, 4]} />
          <meshStandardMaterial 
            color="#ff6f00"
            emissive="#ff6f00"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Temple Lights */}
        {[-3, 3].map((x) =>
          [-3, 3].map((z) => (
            <pointLight
              key={`${x}-${z}`}
              position={[x, 2, z]}
              intensity={2}
              distance={10}
              color="#ffeb3b"
            />
          ))
        )}
      </group>

      {/* Connecting Bridges */}
      {/* Ruins to Center */}
      <mesh position={[-12.5, 0.5, 0]} receiveShadow>
        <boxGeometry args={[10, 0.5, 3]} />
        <meshStandardMaterial color="#546e7a" />
      </mesh>

      {/* Forest to Center */}
      <mesh position={[12.5, 0.5, 0]} receiveShadow>
        <boxGeometry args={[10, 0.5, 3]} />
        <meshStandardMaterial color="#546e7a" />
      </mesh>

      {/* Temple to Center */}
      <mesh position={[0, 0.5, 12.5]} receiveShadow>
        <boxGeometry args={[3, 0.5, 10]} />
        <meshStandardMaterial color="#546e7a" />
      </mesh>

      {/* Floating Platforms */}
      {[
        { pos: [-15, 5, 15], size: 4 },
        { pos: [15, 6, -15], size: 3.5 },
        { pos: [0, 8, -20], size: 5 },
        { pos: [-20, 4, -10], size: 3 },
        { pos: [18, 7, 12], size: 4 },
      ].map((platform, i) => (
        <mesh key={i} position={platform.pos as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={[platform.size, 0.5, platform.size]} />
          <meshStandardMaterial 
            color="#78909c"
            emissive="#546e7a"
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}

      {/* Atmospheric Fog */}
      <fog attach="fog" args={['#1a1a2e', 30, 100]} />
    </group>
  );
};
