const { app, server } = require('./app');
const db = require('./models');
const dotenv = require('dotenv');
//const express = require('express');

dotenv.config();

const PORT = process.env.PORT

db.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
    server.listen(PORT, (err) => {
      if (err) {
        return console.error('Failed', err);
      }
      console.log(`Listening on port ${PORT}`);
      return app;
    });
  })
  .catch((err) => console.error('Unable to connect to the database:', err));