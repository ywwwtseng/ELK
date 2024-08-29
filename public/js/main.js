import KeyboardState from './KeyboardState.js';
import Timer from './Timer.js';
import Player from './Player.js';
import View from './View.js';
import Game from './Game.js';

document.addEventListener('DOMContentLoaded', function () {
  const isAdminMode = window.location.href.includes('admin=1');
  const isPlayerMode = !isAdminMode;

  const getToken = () => {
    return isAdminMode ? 'admin' : localStorage.getItem('rect-auth');
  };

  const playerLoginForm = new View({
    id: 'player-login-form',
    html: `
      <div class="rect">
        <input autofocus id="player-login-form-input" type="text" placeholder="NAME" />
      </div>
    `,
    mounted: () => {
      const $input = document.getElementById('player-login-form-input');
      $input.addEventListener('keydown', (event) => {
        if (event.code === 'Enter' && event.target.value) {
          socket.emit('login', { name: event.target.value });
        }
      });
    },
  });

  const adminDashBoard = new View({
    id: 'admin-dashboard',
    html: `
      <div class="rect">
        <button id="play-btn">Play</button>
      </div>
    `,
    mounted: () => {
      const $btn = document.getElementById('play-btn');
      $btn.addEventListener('click', function () {
        socket.emit('play');
      });
    },
  });
  
  let player;
  
  if (isPlayerMode) {
    player = new Player();
    const input = new KeyboardState();
  
    input.listenTo(window);
  
    input.addMapping('ArrowUp', (keyState) => {
      player.go.dir.y += keyState ? -1 : 1;
    });
  
    input.addMapping('ArrowDown', (keyState) => {
      player.go.dir.y += keyState ? 1 : -1;
    });
  
    input.addMapping('ArrowLeft', (keyState) => {
      player.go.dir.x += keyState ? -1 : 1;
    });
  
    input.addMapping('ArrowRight', (keyState) => {
      player.go.dir.x += keyState ? 1 : -1;
    });
  }

  const socket = io(window.location.host, { auth: { token: getToken() }});

  socket.on('auth', function (data) {
    if (isPlayerMode) {
      if (data.ok) {
        playerLoginForm.remove();
        localStorage.setItem('rect-auth', data.token);
      } else {
        playerLoginForm.append();
        localStorage.removeItem('rect-auth');
        if (player) {
          player.reset();
        }
      }
    }
    
  });

  const game = new Game();

  socket.on('broadcast', function (data) {
    if (isAdminMode) {
      if (!game.flag) {
        adminDashBoard.append();
      } else {
        adminDashBoard.remove();
      }
    } else {
      const token = getToken();
      if (token && player) {
        if (data.distribution[token]) {
          // init self position
          if (!player.pos) {
            player.pos = data.distribution[token];
          }
  
          delete data.distribution[token];
        } else {
          // you win
          player.reset();
        }
      }
    }

    game.updateState(data);
  });

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const timer = new Timer(1/60);

  timer.update = (deltaTime) => {
    game.draw(ctx);

    if (player && player.pos) {
      const prevPos = [...player.pos];
      const updated = player.update();
      player.draw(ctx);

      if (updated) {
        socket.emit('player:update', { pos: updated.pos });
      }
    }
  };

  timer.start();
});



