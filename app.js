const express = require("express");
const morgan = require("morgan");
const userRouter = require('./routes/userRoutes');
const fileRouter = require('./routes/fileRoutes');
const notificationRouter = require('./routes/notificationRoutes');

const app = express();


app.get('/',(req,res)=>{
  res.status(200).send('hello');
});
// 1) MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}



app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/user', userRouter);
app.use('/api/v1/files', fileRouter);
app.use('/api/v1/notifications', notificationRouter);

module.exports = app;
