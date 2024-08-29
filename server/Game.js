const logger = require('./logger');

class Game {
  constructor() {
    this.flag = null;
    this.distribution = {};
    this.events = {};
  }

  createFlag() {
    this.flag = [Math.floor(676 * Math.random()), Math.floor(676 * Math.random())];
  }

  removeFlag() {
    this.flag = null;
  }

  join(token) {    
    if (this.distribution[token]) {
      return;
    }

    this.distribution[token] = [Math.floor(676 * Math.random()), Math.floor(676 * Math.random())];
  }
  
  getPlayerPos(token) {
    return this.distribution[token];
  }

  sePlayerPos(token, pos) {
    this.distribution[token] = pos;
  }

  ifWin(token) {
    if (!this.flag) {
      return false;
    }

    const pos = this.getPlayerPos(token);

    if (Math.abs(pos[0] - this.flag[0]) <= 24 && Math.abs(pos[1] - this.flag[1]) <= 24) {
      delete this.distribution[token];

      logger.info({ event: 'user.win', token, pos: this.distribution[token] });

      if (Object.keys(this.distribution).length <= 1) {
        logger.info({ event: 'user.lose', token: Object.keys(this.distribution)[0] || token });
        this.end();
      } else {
        this.createFlag();
      }

      return true;
    }
  }

  start() {
    if (!this.flag && Object.keys(this.distribution).length >= 2) {
      this.createFlag();

      logger.info({ event: 'game.start' });
    }
  }

  end() {
    this.distribution = {};
    this.removeFlag();
    if (this.events.end) {
      this.events.end();
    }

    logger.info({ event: 'game.end' });
  }
}

module.exports = Game;