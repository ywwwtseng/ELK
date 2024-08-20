const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const pino = require('pino');
const pinoHttp = require('pino-http');

const app = express();

const logger = pino({
  level: 'info',
  transport: {
    target: 'pino/file', // 可以使用 pino-elasticsearch 傳輸到 Elasticsearch
    options: {
      destination: path.join(__dirname, 'http-requests.log'), // 日誌文件存放位置
      append: true
    },
  },
});

const httpLogger = pinoHttp({
  logger,
});

app.use(httpLogger);

// 使用 body-parser 解析请求体
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 示例路由
app.get('/example', (req, res) => {
  res.send('ok');
});
app.post('/example', (req, res) => {
  res.send('Request received');
});

// 启动服务器
const port = 3002;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
