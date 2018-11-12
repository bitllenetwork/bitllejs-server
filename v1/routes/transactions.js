const express = require('express');
const {checkSchema} = require('express-validator/check');
const BitlleJs = require('bitllejs');
const request = require('request');
const utils = require('../modules/utils');
const config = require('../../config/config');

const bitllejs = new BitlleJs();
const router = express.Router();

bitllejs.web3.setProvider(new bitllejs.web3.providers.HttpProvider("http://localhost"));

let options = {
    json: true
};

const schemaInfo = checkSchema({
    id: {
        in: ['params'],
        errorMessage: 'ID must be integer',
        isInt: true,
        toInt: true
    },
});


module.exports = (app, router) => {
    router.get('/transactions', (req, res, next) => {
        try {
            let query = '?';
            let access_token = utils.getAccessToken(req.headers.authorization);

            options.headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
            };

            if (req.query.type) {
                query += '&type=' + req.query.type;
            }
            if (req.query.status) {
                query += '&status=' + req.query.status;
            }
            if (req.query.page) {
                query += '&page=' + req.query.page;
            }
            if (req.query.sort) {
                query += '&sort=' + req.query.sort;
            }

            request.get(config.restapi.host + '/v' + config.restapi.version + '/transactions' + query, options, (err, httpResponse, body) => {
                if (httpResponse !== undefined && httpResponse.statusCode !== undefined) {
                    if (httpResponse.statusCode === 200) {
                        res.setHeader('x-pagination-current-page', httpResponse.headers["x-pagination-current-page"]);
                        res.setHeader('x-pagination-total-count', httpResponse.headers["x-pagination-total-count"]);
                        res.setHeader('x-pagination-page-count', httpResponse.headers["x-pagination-page-count"]);
                        res.setHeader('x-pagination-per-page', httpResponse.headers["x-pagination-per-page"]);
                    }
                    res.status(httpResponse.statusCode).send(body);
                }
                else {
                    res.status(504).send({
                        status: 504,
                        error: {
                            code: 6,
                            name: 'Gateway Timeout',
                            message: 'Rest server did not respond'
                        }
                    });
                }
            });
        } catch (err) {
            return res.status(400).send({
                status: 400,
                error: {
                    code: 4,
                    name: 'Bad Request',
                    message: err.message
                }
            });
        }
    });

    router.get('/transactions/update', (req, res, next) => {
        try {
            let query = '?';
            let access_token = utils.getAccessToken(req.headers.authorization);

            options.headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
            };

            if (req.query.type) {
                query += '&type=' + req.query.type;
            }
            if (req.query.status) {
                query += '&status=' + req.query.status;
            }
            if (req.query.page) {
                query += '&page=' + req.query.page;
            }
            if (req.query.sort) {
                query += '&sort=' + req.query.sort;
            }

            request.get(config.restapi.host + '/v' + config.restapi.version + '/transactions' + query, options, (err, httpResponse, body) => {
                if (httpResponse !== undefined && httpResponse.statusCode !== undefined) {
                    if (httpResponse.statusCode === 200) {
                        res.setHeader('x-pagination-current-page', httpResponse.headers["x-pagination-current-page"]);
                        res.setHeader('x-pagination-total-count', httpResponse.headers["x-pagination-total-count"]);
                        res.setHeader('x-pagination-page-count', httpResponse.headers["x-pagination-page-count"]);
                        res.setHeader('x-pagination-per-page', httpResponse.headers["x-pagination-per-page"]);

                        for (let i in body) {
                            if (body.hasOwnProperty(i)) {
                                if (body[i].type === 'exchange_order') {
                                    body[i].balance = utils.getCellBalance(JSON.parse(body[i].tx), body[i].cell);
                                }
                            }
                        }
                    }
                    res.status(httpResponse.statusCode).send(body);
                }
                else {
                    res.status(504).send({
                        status: 504,
                        error: {
                            code: 6,
                            name: 'Gateway Timeout',
                            message: 'Rest server did not respond'
                        }
                    });
                }
            });
        } catch (err) {
            return res.status(400).send({
                status: 400,
                error: {
                    code: 4,
                    name: 'Bad Request',
                    message: err.message
                }
            });
        }
    });

    router.get('/transactions/:id', schemaInfo,
        (req, res, next) => {
            try {
                let access_token = utils.getAccessToken(req.headers.authorization);
                let errors = req.validationErrors();

                options.headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                };

                if (errors) {
                    return res.status(422).send({
                        status: 422,
                        error: {
                            code: 3,
                            name: 'Unprocessable Entity',
                            message: 'The specified parameters are incorrect',
                            fields: errors
                        }
                    });
                }
                else {
                    let id = req.params.id;

                    request.get(config.restapi.host + '/v' + config.restapi.version + '/transactions/' + id, options, (err, httpResponse, body) => {
                        if (httpResponse !== undefined && httpResponse.statusCode !== undefined) {
                            res.status(httpResponse.statusCode).send(body);
                        }
                        else {
                            res.status(504).send({
                                status: 504,
                                error: {
                                    code: 6,
                                    name: 'Gateway Timeout',
                                    message: 'Rest server did not respond'
                                }
                            });
                        }
                    });
                }
            } catch (err) {
                return res.status(400).send({
                    status: 400,
                    error: {
                        code: 4,
                        name: 'Bad Request',
                        message: err.message
                    }
                });
            }
        }
    );

    router.get('/transactions/:id/update', schemaInfo,
        (req, res, next) => {
            try {
                let access_token = utils.getAccessToken(req.headers.authorization);
                let errors = req.validationErrors();

                options.headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                };

                if (errors) {
                    return res.status(422).send({
                        status: 422,
                        error: {
                            code: 3,
                            name: 'Unprocessable Entity',
                            message: 'The specified parameters are incorrect',
                            fields: errors
                        }
                    });
                }
                else {
                    let id = req.params.id;

                    request.get(config.restapi.host + '/v' + config.restapi.version + '/transactions/' + id, options, (err, httpResponse, body) => {
                        if (httpResponse !== undefined && httpResponse.statusCode !== undefined) {

                            if (httpResponse.statusCode === 200 && body.type === 'exchange_order') {
                                body.balance = utils.getCellBalance(JSON.parse(body.tx), body.cell);
                            }
                            res.status(httpResponse.statusCode).send(body);
                        }
                        else {
                            res.status(504).send({
                                status: 504,
                                error: {
                                    code: 6,
                                    name: 'Gateway Timeout',
                                    message: 'Rest server did not respond'
                                }
                            });
                        }
                    });
                }
            } catch (err) {
                return res.status(400).send({
                    status: 400,
                    error: {
                        code: 4,
                        name: 'Bad Request',
                        message: err.message
                    }
                });
            }
        }
    );
};