const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const routes = require('./routes');
const { connectDataBase } = require('./models');

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
      process.env.NODE_ENV == 'production' ? morgan('common') : morgan('dev')
    );
    connectDataBase();
    app.use('/', routes);
  };

  start = (port) => {
    this.init();
    const app = this.app;
    const PORT = process.env.PORT || port;
    app.listen(PORT, (err) => {
      if (err) {
        console.error('Error', err);
      } else {
        console.log(`Server listening on PORT: ${PORT}`);
      }
    });
  };
}

module.exports = App;
