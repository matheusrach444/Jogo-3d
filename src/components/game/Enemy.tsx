import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import { EnemyState } from '../../types/game';

interface EnemyProps {
  enemy: EnemyState;
  playerPosition: Vector3;
  timeScale: number;
  onDamage: (enemyId: string, damage: number) => void;
}

export const Enemy: React.FC<EnemyProps> = ({ 
  enemy, 
  playerPosition, 
  timeScale,
  onDamage 
}) => {
  const meshRef = useRef<Mesh>(null);
  const floatOffset = useRef(Math.random() * Math.PI * 2);

  useFrame((state, delta) => {
    if (!meshRef.current || !enemy.isActive) return;

    const scaledDelta = delta * timeScale;
    const speed = enemy.type === 'shadow' ? 2 : enemy.type === 'void' ? 3 : 1.5;

    // Move towards player
    const direction = new Vector3()
      .subVectors(playerPosition, enemy.position)
      .normalize();

    const newPosition = enemy.position.clone();
    newPosition.add(direction.multiplyScalar(speed * scaledDelta));

    // Floating animation
    const floatSpeed = 2;
    const floatAmount = 0.3;
    floatOffset.current += scaledDelta * floatSpeed;
    newPosition.y += Math.sin(floatOffset.current) * floatAmount;

    meshRef.current.position.copy(newPosition);

    // Rotate towards player
    const angle = Math.atan2(direction.x, direction.z);
    meshRef.current.rotation.y = angle;

    // Update enemy position
    enemy.position.copy(newPosition);
  });

  if (!enemy.isActive) return null;

  const getColor = () => {
    switch (enemy.type) {
      case 'shadow': return '#1a1a2e';
      case 'void': return '#0f0f1e';
      case 'eclipse': return '#2d1b3d';
      default: return '#000000';
    }
  };

  const getEmissive = () => {
    switch (enemy.type) {
      case 'shadow': return '#ff1744';
      case 'void': return '#d500f9';
      case 'eclipse': return '#ff6d00';
      default: return '#ff0000';
    }
  };

  const healthPercent = enemy.health / enemy.maxHealth;

  return (
    <group>
      {/* Enemy Body */}
      <mesh ref={meshRef} position={enemy.position.toArray()} castShadow>
        <octahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial
          color={getColor()}
          emissive={getEmissive()}
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Health Bar */}
      {healthPercent < 1 && (
        <sprite position={[enemy.position.x, enemy.position.y + 1.5, enemy.position.z]}>
          <spriteMaterial color="#ff1744" opacity={0.8} />
        </sprite>
      )}

      {/* Dark Aura */}
      <pointLight
        position={enemy.position.toArray()}
        intensity={0.5}
        distance={5}
        color={getEmissive()}
      />
    </group>
  );
};
