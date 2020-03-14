const express = require('express');

// Routers

const hubsRouter = require('./data/hubs-router');

const server = express();

server.use(express.json());

server.use('/api/posts', hubsRouter);

server.get('/', (req, res) => {
  res.send(`
    <h1>Node-API2-Project<h1>
  `);
});

module.exports = server;