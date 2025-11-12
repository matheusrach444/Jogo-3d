import { Vector3 } from 'three';

export interface PlayerState {
  position: Vector3;
  velocity: Vector3;
  rotation: number;
  health: number;
  maxHealth: number;
  timeEnergy: number;
  maxTimeEnergy: number;
  fragments: number;
  isGrounded: boolean;
  isDashing: boolean;
  isAttacking: boolean;
}

export interface EnemyState {
  id: string;
  position: Vector3;
  health: number;
  maxHealth: number;
  type: 'shadow' | 'void' | 'eclipse';
  isActive: boolean;
  targetPosition?: Vector3;
}

export interface GameState {
  player: PlayerState;
  enemies: EnemyState[];
  fragments: FragmentState[];
  currentArea: 'ruins' | 'forest' | 'temple';
  timeScale: number;
  gamePhase: 'intro' | 'playing' | 'victory' | 'defeat';
  totalFragments: number;
  collectedFragments: number;
}

export interface FragmentState {
  id: string;
  position: Vector3;
  collected: boolean;
  area: 'ruins' | 'forest' | 'temple';
}

export interface InputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  dash: boolean;
  attack: boolean;
  slowTime: boolean;
  speedTime: boolean;
  mouseX: number;
  mouseY: number;
}
