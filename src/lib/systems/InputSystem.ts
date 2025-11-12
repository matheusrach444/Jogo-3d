import { InputState } from '../../types/game';

export class InputSystem {
  private state: InputState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    dash: false,
    attack: false,
    slowTime: false,
    speedTime: false,
    mouseX: 0,
    mouseY: 0,
  };

  private keyMap: { [key: string]: keyof InputState } = {
    'w': 'forward',
    'W': 'forward',
    's': 'backward',
    'S': 'backward',
    'a': 'left',
    'A': 'left',
    'd': 'right',
    'D': 'right',
    ' ': 'jump',
    'Shift': 'dash',
    'q': 'slowTime',
    'Q': 'slowTime',
    'e': 'speedTime',
    'E': 'speedTime',
  };

  constructor() {
    this.setupListeners();
  }

  private setupListeners() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    const action = this.keyMap[e.key];
    if (action) {
      this.state[action] = true;
      e.preventDefault();
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    const action = this.keyMap[e.key];
    if (action) {
      this.state[action] = false;
      e.preventDefault();
    }
  };

  private handleMouseMove = (e: MouseEvent) => {
    this.state.mouseX = e.movementX;
    this.state.mouseY = e.movementY;
  };

  private handleMouseDown = (e: MouseEvent) => {
    if (e.button === 0) {
      this.state.attack = true;
    }
  };

  private handleMouseUp = (e: MouseEvent) => {
    if (e.button === 0) {
      this.state.attack = false;
    }
  };

  getState(): InputState {
    return { ...this.state };
  }

  resetMouseDelta() {
    this.state.mouseX = 0;
    this.state.mouseY = 0;
  }

  destroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }
}
