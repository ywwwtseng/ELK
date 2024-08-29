const limitCanvas = (player) => {
  if (player.pos) {
    player.pos[0] = Math.min(Math.max(0, player.pos[0]), 676);
    player.pos[1] = Math.min(Math.max(0, player.pos[1]), 676); 
  }
};

class Player {
  constructor() {
    this.pos = undefined;
    this.go = {
      dir: {
        x: 0,
        y: 0,
      }
    };
  }

  update() {
    if (this.pos) {
      this._prevPos = [this.pos[0], this.pos[1]];
      this.pos[0] += this.go.dir.x * 5;
      this.pos[1] += this.go.dir.y * 5;

      limitCanvas(this);

      if (this._prevPos[0] !== this.pos[0] || this._prevPos[1] !== this.pos[1]) {
        return this;
      }

      return false;
    }
  }

  draw(ctx) {
    if (this.pos) {
      ctx.fillStyle = "green";
      ctx.fillRect(this.pos[0], this.pos[1], 24, 24);
    }
  }

  reset() {
    this._prevPos = null;
    this.pos = null;
  }
}

export default Player;