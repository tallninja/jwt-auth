const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { dbInit } = require('./models');
const routes = require('./routes');

class App {
  constructor() {
    this.app = express();
  }

  init = () => {
    const app = this.app;
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(
      process.env.NODE_ENV === 'production' ? morgan('common') : morgan('dev')
    );
    app.use('/', routes);
    dbInit();
  };

  run = (port) => {
    this.init();
    const app = this.app;
    const PORT = process.env.PORT || port;
    app.listen(PORT, (err) => {
      if (err) {
        console.error('Error', err);
      } else {
        console.log(`Server listeing on PORT: ${PORT}`);
      }
    });
  };
}

module.exports = App;
