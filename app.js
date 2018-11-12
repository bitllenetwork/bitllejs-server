const express = require('express'),
    createError = require('http-errors'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    expressValidator = require('express-validator'),
    indexRouter = require('./routes/index');

let app = express();
let router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.disable('x-powered-by');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(expressValidator());

router.use((req, res, next) => next());

require('./v1/routes')(app, router);

app.use('/', indexRouter);
app.use('/api/v1', router);


app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.json({
        status: (err.status || 500),
        error: {
            name: err.status === 404 ? 'Method not found' : err.name,
            message: err.message,
            code: 0,
        }
    });
});

module.exports = app;