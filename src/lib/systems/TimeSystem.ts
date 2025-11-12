export class TimeSystem {
  private timeScale: number = 1.0;
  private targetTimeScale: number = 1.0;
  private transitionSpeed: number = 3.0;

  update(delta: number): number {
    // Smooth transition to target time scale
    if (Math.abs(this.timeScale - this.targetTimeScale) > 0.01) {
      this.timeScale += (this.targetTimeScale - this.timeScale) * this.transitionSpeed * delta;
    } else {
      this.timeScale = this.targetTimeScale;
    }

    return this.timeScale;
  }

  setTimeScale(scale: number) {
    this.targetTimeScale = Math.max(0.1, Math.min(2.0, scale));
  }

  resetTimeScale() {
    this.targetTimeScale = 1.0;
  }

  getTimeScale(): number {
    return this.timeScale;
  }

  isSlowed(): boolean {
    return this.timeScale < 0.9;
  }

  isFast(): boolean {
    return this.timeScale > 1.1;
  }
}
