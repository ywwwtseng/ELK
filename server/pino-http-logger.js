const pino = require('pino');
const pinoHttp = require('pino-http');
const path = require('path');

const httpLogger = pinoHttp({
  logger: pino({
    level: 'info',
    transport: {
      target: 'pino/file', // 可以使用 pino-elasticsearch 傳輸到 Elasticsearch
      options: {
        destination: path.join(__dirname, '..', 'http-requests.log'), // 日誌文件存放位置
        append: true
      },
    },
  }),
});




module.exports = (app) => {
  app.use(httpLogger);
};