const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const fileRouter = require('./routes/fileRoutes');
const notificationRouter = require('./routes/notificationRoutes');
const path = require('path');
const cors = require('cors')

const app = express();

app.use(cors())

// 1) MIDDLEWARES
app.use(helmet.contentSecurityPolicy({
    useDefaults:true,
    directives:{
        "img-src":["'self'","https:"],
        "frame-src":["'self'","https:"],
        "default-src":["'self'","http"],
        "script-src-attr":["https:"]
    }
}))

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const limiter = rateLimit({
    max: 15000,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour'
});
app.use('/', limiter);

app.use(express.json({ limit: '10kb' }));

app.use(mongoSanitize());

app.use(xss());

app.use(hpp());

app.use('/user', userRouter);
app.use('/files', fileRouter);
app.use('/notifications', notificationRouter);

app.use(express.static(process.cwd() + "/online-learning-platform-front/dist/osos-website"));

app.get('*', (req, res) => {
    res.sendFile(process.cwd() + "/online-learning-platform-front/dist/osos-website/index.html");
});
  

module.exports = app;