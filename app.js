const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

// web socket
const WebSocket = require('ws');

// replace with passport token
// const serverToken = jwt.sign({
//   name: 'cis557server',
//   team: ['Yifeng Mao', 'Zitong Zhu'],
// }, 'watch_the_fun', { expiresIn: '1h' });
// const wsUrl = 'ws://localhost:8082/';
// const wsConnection = new WebSocket(wsUrl, {
//   headers: { token: serverToken },
// });
// wsConnection.onopen = () => {
//   wsConnection.send('["cis557server"]');
// };
// wsConnection.onerror = (err) => {
//   console.log(`WebSocket error: ${err}`);
// };
// wsConnection.onmessage = (mess) => {
//   console.log(mess.data);
// };

const index = require('./routes/index');
// var users = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// reset the limit of the transmission
// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('Login');
});

app.listen('8081', () => {
  console.log('Server running on port 8081');
});

module.exports = app;