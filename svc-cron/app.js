require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

var indexRouter = require('./routes/index');
var tokensRouter = require('./routes/tokens');
var appointmentsRouter = require('./routes/appointments');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/tokens', tokensRouter);
app.use('/appointments', appointmentsRouter);

module.exports = app;
