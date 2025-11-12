import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Vector3 } from 'three';
import { Player } from './Player';
import { Enemy } from './Enemy';
import { Fragment } from './Fragment';
import { World } from './World';
import { GameUI } from './GameUI';
import { InputSystem } from '../../lib/systems/InputSystem';
import { TimeSystem } from '../../lib/systems/TimeSystem';
import { GameState, EnemyState, FragmentState } from '../../types/game';

export const Game: React.FC = () => {
  const inputSystemRef = useRef<InputSystem>();
  const timeSystemRef = useRef<TimeSystem>(new TimeSystem());
  const cameraRotationX = useRef(0);

  const [gameState, setGameState] = useState<GameState>({
    player: {
      position: new Vector3(0, 1, 0),
      velocity: new Vector3(0, 0, 0),
      rotation: 0,
      health: 100,
      maxHealth: 100,
      timeEnergy: 100,
      maxTimeEnergy: 100,
      fragments: 0,
      isGrounded: true,
      isDashing: false,
      isAttacking: false,
    },
    enemies: [],
    fragments: [],
    currentArea: 'ruins',
    timeScale: 1,
    gamePhase: 'intro',
    totalFragments: 9,
    collectedFragments: 0,
  });

  // Initialize game
  useEffect(() => {
    inputSystemRef.current = new InputSystem();

    // Initialize enemies
    const initialEnemies: EnemyState[] = [
      // Ruins enemies
      { id: 'e1', position: new Vector3(-25, 2, 5), health: 30, maxHealth: 30, type: 'shadow', isActive: true },
      { id: 'e2', position: new Vector3(-20, 2, -5), health: 30, maxHealth: 30, type: 'shadow', isActive: true },
      { id: 'e3', position: new Vector3(-30, 2, 0), health: 50, maxHealth: 50, type: 'void', isActive: true },
      
      // Forest enemies
      { id: 'e4', position: new Vector3(25, 2, 5), health: 30, maxHealth: 30, type: 'shadow', isActive: true },
      { id: 'e5', position: new Vector3(20, 2, -5), health: 30, maxHealth: 30, type: 'shadow', isActive: true },
      { id: 'e6', position: new Vector3(30, 2, 0), health: 50, maxHealth: 50, type: 'void', isActive: true },
      
      // Temple enemies
      { id: 'e7', position: new Vector3(0, 2, 30), health: 70, maxHealth: 70, type: 'eclipse', isActive: true },
      { id: 'e8', position: new Vector3(-5, 2, 28), health: 50, maxHealth: 50, type: 'void', isActive: true },
      { id: 'e9', position: new Vector3(5, 2, 28), health: 50, maxHealth: 50, type: 'void', isActive: true },
    ];

    // Initialize fragments
    const initialFragments: FragmentState[] = [
      // Ruins fragments
      { id: 'f1', position: new Vector3(-25, 3, 0), collected: false, area: 'ruins' },
      { id: 'f2', position: new Vector3(-20, 6, -8), collected: false, area: 'ruins' },
      { id: 'f3', position: new Vector3(-30, 4, 8), collected: false, area: 'ruins' },
      
      // Forest fragments
      { id: 'f4', position: new Vector3(25, 3, 0), collected: false, area: 'forest' },
      { id: 'f5', position: new Vector3(20, 6, 8), collected: false, area: 'forest' },
      { id: 'f6', position: new Vector3(30, 4, -8), collected: false, area: 'forest' },
      
      // Temple fragments
      { id: 'f7', position: new Vector3(0, 3, 25), collected: false, area: 'temple' },
      { id: 'f8', position: new Vector3(-5, 8, 30), collected: false, area: 'temple' },
      { id: 'f9', position: new Vector3(5, 8, 30), collected: false, area: 'temple' },
    ];

    setGameState(prev => ({
      ...prev,
      enemies: initialEnemies,
      fragments: initialFragments,
    }));

    // Start game on pointer lock
    const handlePointerLock = () => {
      setGameState(prev => ({ ...prev, gamePhase: 'playing' }));
    };

    document.addEventListener('pointerlockchange', handlePointerLock);

    return () => {
      inputSystemRef.current?.destroy();
      document.removeEventListener('pointerlockchange', handlePointerLock);
    };
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState.gamePhase !== 'playing') return;

    const interval = setInterval(() => {
      if (!inputSystemRef.current) return;

      const input = inputSystemRef.current.getState();

      // Time manipulation
      if (input.slowTime && gameState.player.timeEnergy > 0) {
        timeSystemRef.current.setTimeScale(0.3);
        setGameState(prev => ({
          ...prev,
          player: {
            ...prev.player,
            timeEnergy: Math.max(0, prev.player.timeEnergy - 0.5),
          },
        }));
      } else if (input.speedTime && gameState.player.timeEnergy > 0) {
        timeSystemRef.current.setTimeScale(1.8);
        setGameState(prev => ({
          ...prev,
          player: {
            ...prev.player,
            timeEnergy: Math.max(0, prev.player.timeEnergy - 0.5),
          },
        }));
      } else {
        timeSystemRef.current.resetTimeScale();
        // Regenerate time energy
        setGameState(prev => ({
          ...prev,
          player: {
            ...prev.player,
            timeEnergy: Math.min(prev.player.maxTimeEnergy, prev.player.timeEnergy + 0.3),
          },
        }));
      }

      const currentTimeScale = timeSystemRef.current.update(0.016);
      setGameState(prev => ({ ...prev, timeScale: currentTimeScale }));

      // Check enemy collisions with player
      gameState.enemies.forEach(enemy => {
        if (!enemy.isActive) return;
        const distance = enemy.position.distanceTo(gameState.player.position);
        if (distance < 1.5) {
          setGameState(prev => ({
            ...prev,
            player: {
              ...prev.player,
              health: Math.max(0, prev.player.health - 0.5),
            },
          }));
        }
      });

      // Check defeat
      if (gameState.player.health <= 0) {
        setGameState(prev => ({ ...prev, gamePhase: 'defeat' }));
      }

      // Check victory
      if (gameState.collectedFragments >= gameState.totalFragments) {
        setGameState(prev => ({ ...prev, gamePhase: 'victory' }));
      }

      inputSystemRef.current.resetMouseDelta();
    }, 16);

    return () => clearInterval(interval);
  }, [gameState]);

  const handleUpdatePlayer = (updates: Partial<typeof gameState.player>) => {
    setGameState(prev => ({
      ...prev,
      player: { ...prev.player, ...updates },
    }));
  };

  const handleAttack = () => {
    const attackRange = 5;
    const attackDamage = 20;

    gameState.enemies.forEach(enemy => {
      if (!enemy.isActive) return;
      const distance = enemy.position.distanceTo(gameState.player.position);
      if (distance < attackRange) {
        handleEnemyDamage(enemy.id, attackDamage);
      }
    });
  };

  const handleEnemyDamage = (enemyId: string, damage: number) => {
    setGameState(prev => ({
      ...prev,
      enemies: prev.enemies.map(enemy => {
        if (enemy.id === enemyId) {
          const newHealth = enemy.health - damage;
          return {
            ...enemy,
            health: newHealth,
            isActive: newHealth > 0,
          };
        }
        return enemy;
      }),
    }));
  };

  const handleCollectFragment = (fragmentId: string) => {
    setGameState(prev => ({
      ...prev,
      fragments: prev.fragments.map(f =>
        f.id === fragmentId ? { ...f, collected: true } : f
      ),
      collectedFragments: prev.collectedFragments + 1,
      player: {
        ...prev.player,
        health: Math.min(prev.player.maxHealth, prev.player.health + 20),
        timeEnergy: prev.player.maxTimeEnergy,
      },
    }));
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-[#0f0f1e] to-[#1a1a2e]">
      <Canvas
        shadows
        camera={{ position: [0, 5, 10], fov: 75 }}
        onCreated={({ camera }) => {
          camera.lookAt(0, 0, 0);
        }}
      >
        {/* World */}
        <World currentArea={gameState.currentArea} />

        {/* Player */}
        {gameState.gamePhase === 'playing' && inputSystemRef.current && (
          <Player
            playerState={gameState.player}
            inputState={inputSystemRef.current.getState()}
            timeScale={gameState.timeScale}
            onUpdatePlayer={handleUpdatePlayer}
            onAttack={handleAttack}
          />
        )}

        {/* Enemies */}
        {gameState.enemies.map(enemy => (
          <Enemy
            key={enemy.id}
            enemy={enemy}
            playerPosition={gameState.player.position}
            timeScale={gameState.timeScale}
            onDamage={handleEnemyDamage}
          />
        ))}

        {/* Fragments */}
        {gameState.fragments.map(fragment => (
          <Fragment
            key={fragment.id}
            fragment={fragment}
            onCollect={handleCollectFragment}
            playerPosition={gameState.player.position.toArray() as [number, number, number]}
          />
        ))}

        {/* Camera Follow Player */}
        {gameState.gamePhase === 'playing' && (
          <CameraController
            playerPosition={gameState.player.position}
            playerRotation={gameState.player.rotation}
          />
        )}
      </Canvas>

      {/* UI */}
      <GameUI gameState={gameState} />
    </div>
  );
};

// Camera Controller Component
const CameraController: React.FC<{ playerPosition: Vector3; playerRotation: number }> = ({
  playerPosition,
  playerRotation,
}) => {
  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (canvas && document.pointerLockElement !== canvas) {
      canvas.requestPointerLock();
    }
  }, []);

  return (
    <group position={[
      playerPosition.x - Math.sin(playerRotation) * 8,
      playerPosition.y + 4,
      playerPosition.z - Math.cos(playerRotation) * 8,
    ]}>
      <perspectiveCamera />
    </group>
  );
};
