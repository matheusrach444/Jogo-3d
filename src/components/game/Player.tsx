import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import { PlayerState, InputState } from '../../types/game';

interface PlayerProps {
  playerState: PlayerState;
  inputState: InputState;
  timeScale: number;
  onUpdatePlayer: (updates: Partial<PlayerState>) => void;
  onAttack: () => void;
}

export const Player: React.FC<PlayerProps> = ({ 
  playerState, 
  inputState, 
  timeScale,
  onUpdatePlayer,
  onAttack 
}) => {
  const meshRef = useRef<Mesh>(null);
  const attackCooldown = useRef(0);
  const dashCooldown = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const scaledDelta = delta * timeScale;
    const speed = 8;
    const jumpForce = 12;
    const dashForce = 20;
    const gravity = -25;
    const friction = 0.85;

    // Camera rotation from mouse
    const rotationSpeed = 0.002;
    const newRotation = playerState.rotation - inputState.mouseX * rotationSpeed;

    // Movement direction based on rotation
    const forward = new Vector3(
      Math.sin(newRotation),
      0,
      Math.cos(newRotation)
    );
    const right = new Vector3(
      Math.cos(newRotation),
      0,
      -Math.sin(newRotation)
    );

    // Calculate movement
    const movement = new Vector3();
    if (inputState.forward) movement.add(forward);
    if (inputState.backward) movement.sub(forward);
    if (inputState.left) movement.sub(right);
    if (inputState.right) movement.add(right);
    
    if (movement.length() > 0) {
      movement.normalize().multiplyScalar(speed * scaledDelta);
    }

    // Update velocity
    const newVelocity = playerState.velocity.clone();
    newVelocity.x += movement.x;
    newVelocity.z += movement.z;

    // Apply friction
    newVelocity.x *= friction;
    newVelocity.z *= friction;

    // Jump
    if (inputState.jump && playerState.isGrounded) {
      newVelocity.y = jumpForce;
    }

    // Dash
    dashCooldown.current -= scaledDelta;
    if (inputState.dash && dashCooldown.current <= 0 && playerState.isGrounded) {
      const dashDir = movement.length() > 0 ? movement.clone().normalize() : forward;
      newVelocity.x += dashDir.x * dashForce;
      newVelocity.z += dashDir.z * dashForce;
      dashCooldown.current = 1.0;
    }

    // Gravity
    if (!playerState.isGrounded) {
      newVelocity.y += gravity * scaledDelta;
    }

    // Update position
    const newPosition = playerState.position.clone();
    newPosition.add(newVelocity.clone().multiplyScalar(scaledDelta));

    // Ground collision (simple)
    const groundY = 1;
    const isGrounded = newPosition.y <= groundY;
    if (isGrounded) {
      newPosition.y = groundY;
      newVelocity.y = 0;
    }

    // Keep player in bounds
    const maxDistance = 50;
    if (newPosition.length() > maxDistance) {
      newPosition.normalize().multiplyScalar(maxDistance);
    }

    // Attack
    attackCooldown.current -= scaledDelta;
    if (inputState.attack && attackCooldown.current <= 0) {
      onAttack();
      attackCooldown.current = 0.5;
    }

    // Update mesh position
    meshRef.current.position.copy(newPosition);
    meshRef.current.rotation.y = newRotation;

    // Update state
    onUpdatePlayer({
      position: newPosition,
      velocity: newVelocity,
      rotation: newRotation,
      isGrounded,
    });
  });

  return (
    <group>
      {/* Player Body */}
      <mesh ref={meshRef} position={playerState.position.toArray()} castShadow>
        <capsuleGeometry args={[0.5, 1, 8, 16]} />
        <meshStandardMaterial 
          color="#4fc3f7" 
          emissive="#29b6f6"
          emissiveIntensity={0.3}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Light Aura */}
      <pointLight
        position={playerState.position.toArray()}
        intensity={2}
        distance={10}
        color="#4fc3f7"
        castShadow
      />

      {/* Direction Indicator */}
      <mesh 
        position={[
          playerState.position.x + Math.sin(playerState.rotation) * 0.8,
          playerState.position.y + 0.5,
          playerState.position.z + Math.cos(playerState.rotation) * 0.8
        ]}
      >
        <coneGeometry args={[0.2, 0.4, 8]} />
        <meshStandardMaterial 
          color="#ffeb3b"
          emissive="#fdd835"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
};
