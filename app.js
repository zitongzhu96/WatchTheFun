const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

// web socket
const WebSocket = require('ws');

// replace with passport token
const serverToken = jwt.sign({
  name: 'cis557server',
  team: ['Yifeng Mao','Zitong Zhu'],
}, 'watch_the_fun', { expiresIn: '1h' });
const ws_url = 'ws://localhost:8082/';
const ws_connection = new WebSocket(ws_url, {
  headers: { token: serverToken },
});
ws_connection.onopen = () => {
  ws_connection.send('["cis557server"]');
};
ws_connection.onerror = (err) => {
  console.log(`WebSocket error: ${err}`);
};
ws_connection.onmessage = (mess) => {
  console.log(mess.data);
};

var index = require('./routes/index');
// var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// reset the limit of the transmission 
// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('Login');
});

app.listen('8081', function() {
  console.log('Server running on port 8081');
});

module.exports = app;