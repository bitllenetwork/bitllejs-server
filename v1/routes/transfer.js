const express = require('express');
const {checkSchema} = require('express-validator/check');
const BitlleJs = require('bitllejs');
const request = require('request');
const utils = require('../modules/utils');
const config = require('../../config/config');

const bitllejs = new BitlleJs();

bitllejs.web3.setProvider(new bitllejs.web3.providers.HttpProvider(config.rpc[1]));

let options = {
    json: true
};

const schemaIndex = checkSchema({
    tokenAddr: {
        custom: {
            errorMessage: 'address is empty or invalid',
            options: (value) => {
                value = bitllejs.web3.toChecksumAddress(value);
                return bitllejs.web3.isAddress(value) && bitllejs.web3.isChecksumAddress(value);
            }
        },
    },
    toAddr: {
        custom: {
            errorMessage: 'toAddr is empty or invalid',
            options: (value) => {
                value = bitllejs.web3.toChecksumAddress(value);
                return bitllejs.web3.isAddress(value) && bitllejs.web3.isChecksumAddress(value);
            }
        },
    },
    amount: {
        custom: {
            errorMessage: 'Invalid amount or insufficience balance',
            options: (value, {req, location, path}) => {
                if (!req.body.mint) {
                    try {
                        const fee = utils.getFee();
                        let amountFee = value * fee.fee;
                        if (amountFee < fee.feeMin) {
                            amountFee = fee.feeMin;
                        }

                        utils.checkBalance(bitllejs.web3.toWei(value - -amountFee), req.body.tokenAddr, req.body.privateKey);

                        return value ? value : false;
                    }
                    catch (err) {
                        return false;
                    }
                }
                else {
                    return value ? value : false;
                }
            }
        },
    },
    privateKey: {
        custom: {
            errorMessage: 'Empty private key',
            options: (value) => {
                return !value ? 0 : 1;
            }
        },
    }
});


module.exports = (app, router) => {
    router.post('/transfer', schemaIndex, (req, res, next) => {
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
                let externalId = req.body.externalId ? req.body.externalId.toString() : null,
                    tokenAddr = req.body.tokenAddr,
                    toAddr = req.body.toAddr,
                    amount = bitllejs.web3.toWei(req.body.amount),
                    privateKey = req.body.privateKey,
                    mint = req.body.mint;

                const fee = utils.getFee(access_token);
                let amountFee = amount * fee.fee;

                if (amountFee < fee.feeMin) {
                    amountFee = fee.feeMin;
                }

                if (mint) {
                    let tx = bitllejs.signer.getMintSig(tokenAddr, toAddr, amount, amountFee, privateKey);

                    options.body = {
                        type: 'mint',
                        tx: JSON.stringify(tx),
                        externalId: externalId
                    };
                }
                else {
                    let tx = bitllejs.signer.getTransferSig(tokenAddr, toAddr, amount, amountFee, privateKey);

                    options.body = {
                        type: 'transfer',
                        tx: JSON.stringify(tx),
                        externalId: externalId
                    };
                }

                request.post(config.restapi.host + '/v' + config.restapi.version + '/transactions', options, (err, httpResponse, body) => {
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
            return res.status(400).json({
                status: 400,
                error: {
                    code: 4,
                    name: 'Bad Request',
                    message: err.message
                }
            });
        }
    });
};