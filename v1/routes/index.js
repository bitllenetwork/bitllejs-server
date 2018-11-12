const transferRouter = require('./transfer');
const exchangeRouter = require('./exchange');
const accountsRouter = require('./accounts');
const transactionsRouter = require('./transactions');
const infoRouter = require('./info');

module.exports = function (app, router) {
    router.get('/', function (req, res, next) {
        return res.status(200).json({success: true, message: 'Bitllejs-server: api version 1', data: {}});
    });

    transferRouter(app, router);
    exchangeRouter(app, router);
    accountsRouter(app, router);
    transactionsRouter(app, router);
    infoRouter(app, router);
};