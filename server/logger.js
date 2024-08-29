const pino = require('pino');
const path = require('path');

const logger = pino({
  transport: {
    target: 'pino/file', // 可以使用 pino-elasticsearch 傳輸到 Elasticsearch
    options: {
      destination: path.join(__dirname, '..', 'rect-game.log'), // 日誌文件存放位置
      append: true
    },
  },
});

module.exports = logger;