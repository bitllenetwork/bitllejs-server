const express = require('express');
const BitlleJs = require('bitllejs');
const request = require('request');
const utils = require('../modules/utils');
const {checkSchema} = require('express-validator/check');
const config = require('../../config/config');

const bitllejs = new BitlleJs();

bitllejs.web3.setProvider(new bitllejs.web3.providers.HttpProvider(config.rpc[1]));

let options = {
    json: true
};

const schemaPair = checkSchema({
    tknSellAddr: {
        in: 'params',
        custom: {
            errorMessage: 'tknSellAddr is empty or invalid',
            options: (value) => {
                value = bitllejs.web3.toChecksumAddress(value);
                return bitllejs.web3.isAddress(value) && bitllejs.web3.isChecksumAddress(value);
            }
        },
    },
    tknBuyAddr: {
        in: 'params',
        custom: {
            errorMessage: 'tknBuyAddr is empty or invalid',
            options: (value) => {
                value = bitllejs.web3.toChecksumAddress(value);
                return bitllejs.web3.isAddress(value) && bitllejs.web3.isChecksumAddress(value);
            }
        },
    },
});

const schemaPairAmount = checkSchema({
    tknSellAddr: {
        in: 'params',
        custom: {
            errorMessage: 'tknSellAddr is empty or invalid',
            options: (value) => {
                value = bitllejs.web3.toChecksumAddress(value);
                return bitllejs.web3.isAddress(value) && bitllejs.web3.isChecksumAddress(value);
            }
        },
    },
    tknBuyAddr: {
        in: 'params',
        custom: {
            errorMessage: 'tknBuyAddr is empty or invalid',
            options: (value) => {
                value = bitllejs.web3.toChecksumAddress(value);
                return bitllejs.web3.isAddress(value) && bitllejs.web3.isChecksumAddress(value);
            }
        },
    },
});


module.exports = (app, router) => {
    router.get('/info/fee', (req, res, next) => {
        try {
            let data = utils.getFee();
            let fee = data.fee;
            let feeMin = data.feeMin;

            res.status(200).send({fee, feeMin});
        } catch (err) {
            return res.status(200).send({
                status: 400,
                error: {
                    code: 4,
                    name: 'Bad Request',
                    message: err.message
                }
            });
        }
    });

    router.get('/info/pair/:tknSellAddr/:tknBuyAddr', schemaPair, (req, res, next) => {
        try {
            let tknSellAddr = req.params.tknSellAddr,
                tknBuyAddr = req.params.tknBuyAddr;

            let amount = bitllejs.web3.toWei(1000000);
            let orderBook = bitllejs.exchange.getTradeParam(tknBuyAddr, tknSellAddr, amount);

            let sellVolume = bitllejs.web3.fromWei(amount - orderBook.amountRest);
            let buyVolume = bitllejs.web3.fromWei(orderBook.amountGet);
            let rate = (amount - orderBook.amountRest) / orderBook.amountGet;

            if (isNaN(rate)) rate = 0;

            res.status(200).send({sellVolume: sellVolume, buyVolume: buyVolume, rate: rate.toString(), orderBook});
        } catch (err) {
            return res.status(200).send({
                status: 400,
                error: {
                    code: 4,
                    name: 'Bad Request',
                    message: err.message
                }
            });
        }
    });

    router.get('/info/pair/:tknSellAddr/:tknBuyAddr/:amount', schemaPairAmount, (req, res, next) => {
        try {
            let tknSellAddr = req.params.tknSellAddr,
                tknBuyAddr = req.params.tknBuyAddr,
                amount = req.params.amount;

            amount = bitllejs.web3.toWei(amount);
            let orderBook = bitllejs.exchange.getTradeParam(tknBuyAddr, tknSellAddr, amount);

            let buyVolume = bitllejs.web3.fromWei(orderBook.amountGet);
            let rate = (amount - orderBook.amountRest) / orderBook.amountGet;
            let sellVolume = bitllejs.web3.fromWei(amount - orderBook.amountRest);

            if (isNaN(rate)) rate = 0;

            res.status(200).send({sellVolume: sellVolume, buyVolume: buyVolume, rate: rate.toString()});
        } catch (err) {
            return res.status(200).send({
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