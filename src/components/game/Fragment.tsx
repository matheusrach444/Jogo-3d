import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { FragmentState } from '../../types/game';

interface FragmentProps {
  fragment: FragmentState;
  onCollect: (id: string) => void;
  playerPosition: [number, number, number];
}

export const Fragment: React.FC<FragmentProps> = ({ 
  fragment, 
  onCollect,
  playerPosition 
}) => {
  const meshRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current || !glowRef.current || fragment.collected) return;

    // Rotate fragment
    meshRef.current.rotation.y += 0.02;
    meshRef.current.rotation.x += 0.01;

    // Pulse glow
    const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.5 + 1;
    glowRef.current.scale.setScalar(pulse);

    // Check collection distance
    const dx = playerPosition[0] - fragment.position.x;
    const dy = playerPosition[1] - fragment.position.y;
    const dz = playerPosition[2] - fragment.position.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (distance < 2) {
      onCollect(fragment.id);
    }
  });

  if (fragment.collected) return null;

  return (
    <group position={fragment.position.toArray()}>
      {/* Fragment Core */}
      <mesh ref={meshRef} castShadow>
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffeb3b"
          emissiveIntensity={1}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Glow Effect */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial
          color="#ffeb3b"
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Light */}
      <pointLight
        intensity={3}
        distance={15}
        color="#ffd700"
        castShadow
      />

      {/* Particles Ring */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 1.5;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle * 2) * 0.5,
              Math.sin(angle) * radius
            ]}
          >
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="#ffeb3b" />
          </mesh>
        );
      })}
    </group>
  );
};
