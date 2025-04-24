const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const setupMiddleware = (app) => {
  app.use(cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
  }));

  app.use(bodyParser.json());
  app.use(express.json());
};

module.exports = setupMiddleware;
