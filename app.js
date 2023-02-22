var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const db = require('./config/db')()
// const subscriber = require('./subscriber')()


var indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
const { projectManagement } = require('firebase-admin');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter)


app.use(express.static("./views/"));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.render('index')
});//主頁面

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// app.get('/api/datas', (req, res) => {
//   console.log(res.data.timestamp)
//   res.render('histroy',{temp:res.data.temperature,humi:res.data.humidity,time:res.data.timestamp})
// });

//主頁面
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
