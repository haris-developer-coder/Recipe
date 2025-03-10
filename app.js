var express = require('express');
var path = require('path');
var logger = require('morgan');
const { mongoConnect } = require('./config/database');
const port = 3000 || process.env.PORT;
const cronJobs = require('./Functions/CronJobs');
const cron = require('node-cron');

var usersRouter = require('./routes/users');
var recipeRouter = require('./routes/recipe');
var ratingRouter = require('./routes/rating');
var likesRouter = require('./routes/likes');
var indexRouter = require('./routes/index');
var productRouter = require('./routes/product');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use(indexRouter);
app.use(usersRouter);
app.use(recipeRouter);
app.use(ratingRouter);
app.use(likesRouter);
app.use(productRouter);

//Cron Jobs
// cron.schedule('*/10 * * * *', () => {
//   cronJobs.deleteDataAfter10Minutes();
// });

app.use((req, res, next) => {
  return res.status(404).json({
    status: 404,
    error: null,
    message: 'Not Found'
  });
});

mongoConnect(() => {
  app.listen(port, () => {
    console.log(`Server Started at: http://localhost:${port}`);
  });
})

module.exports = app;