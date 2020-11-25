import { World } from "ecsy"

export default class Engine {
  readonly world: World

  constructor() {
    this.world = new World()
  }

  private interval?: number
  private tick: number = 0

  update() {
    this.world.execute(this.interval, this.tick++)
  }

  start(fps: number): void {
    // Begin game loop
    this.interval = window.setInterval(() => this.update(), 1000 / fps)
  }

  stop(): void {
    clearInterval(this.interval)
  }
}
