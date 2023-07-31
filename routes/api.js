let express = require('express');

let bookRouter = require('./book');

let app = express();

app.use('/book/', bookRouter);

module.exports = app;
