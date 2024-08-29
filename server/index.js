const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('./logger');
const setupPinoHttpLogger = require('./pino-http-logger');
const Game = require('./Game');

const app = express();

const server = http.createServer(app);

const io = socketIo(server);
setupPinoHttpLogger(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const game = new Game();

game.events.end = () => {
  io.emit('auth', { ok: false });
};


io.on('connection', (socket) => {
  let token = socket.handshake.auth.token;
  socket.emit('auth', { ok: Boolean(game.getPlayerPos(token)), token });

  socket.on('login', (data) => {
    if (!game.distribution[data.name] && !game.flag) {
      token = data.name;
      game.join(token);

      socket.emit('auth', { ok: true, token });
      logger.info({ event: 'user.login', token });
    } else {
      socket.emit('auth', { ok: false });
    }
  });

  socket.on('play', (data) => {
    game.start();
  });

  socket.on('player:update', (data) => {
    if (game.getPlayerPos(token)) {
      game.sePlayerPos(token, data.pos);
      game.ifWin(token);
    }
  });

  socket.on('disconnect', () => {});
});

const tickRate = 60;
const sendData = () => {
  io.emit('broadcast', {  timestamp: new Date(), distribution: game.distribution, flag: game.flag });
  setTimeout(sendData, tickRate);
};

sendData();

// 启动服务器
const port = 3002;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
