class Game {
  constructor() {
    this.flag = null;
    this.distribution = {};
  }

  get isEnd() {
    return !this.flag;
  }

  updateState(data) {
    if (!data) {
      return;
    }

    this.flag = data.flag;
    this.distribution = data.distribution;
  }

  draw(ctx) {
    ctx.clearRect(0, 0, 700, 700);

    ctx.fillStyle = 'green';

    Object.entries(this.distribution).forEach(([key, [x, y]]) => {
      ctx.fillRect(x, y, 24, 24);
    });

    ctx.fillStyle = 'red';

    if (this.flag) {
      ctx.fillRect(this.flag[0], this.flag[1], 24, 24);
    }

  }
}

export default Game;