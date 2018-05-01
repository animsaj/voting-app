if (process.env.NODE_ENV === undefined || process.env.NODE_ENV == null || process.env.NODE_ENV == 'development') {
  require('./config/config');
}
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const { mongoose } = require("./db");

app.use('/polls', require('./controllers/polls'));
app.use('/users', require('./controllers/users'));

app.listen(process.env.PORT, () => {
  console.log('Listening...')
});

module.exports = {
  app
}
