const express = require('express');
const {checkSchema} = require('express-validator/check');
const BitlleJs = require('bitllejs');
const utils = require('../modules/utils');
const config = require('../../config/config');

const bitllejs = new BitlleJs();

bitllejs.web3.setProvider(new bitllejs.web3.providers.HttpProvider(config.rpc[1]));

const schemaIndex = checkSchema({
    login: {
        custom: {
            errorMessage: 'login is required',
            options: (value) => {
                return value ? 1 : 0;
            }
        },
    },
    password: {
        custom: {
            errorMessage: 'password is required',
            options: (value) => {
                return value ? 1 : 0;
            }
        },
    },
});

const schemaBalance = checkSchema({
    address: {
        in: 'params',
        custom: {
            errorMessage: 'address is empty or invalid',
            options: (value) => {
                value = bitllejs.web3.toChecksumAddress(value);
                return bitllejs.web3.isAddress(value) && bitllejs.web3.isChecksumAddress(value);
            }
        },
    },
    tokenAddr: {
        in: 'params',
        custom: {
            errorMessage: 'tokenAddr is empty or invalid',
            options: (value) => {
                value = bitllejs.web3.toChecksumAddress(value);
                return bitllejs.web3.isAddress(value) && bitllejs.web3.isChecksumAddress(value);
            }
        },
    },
});

const schemaChangePassword = checkSchema({
    jsonFile: {
        in: 'body',
        custom: {
            errorMessage: 'jsonFile is required',
            options: (value) => {
                return value ? 1 : 0;
            }
        },
    },
    oldpassword: {
        custom: {
            errorMessage: 'oldPassword is required',
            options: (value) => {
                return value ? 1 : 0;
            }
        },
    },
    password: {
        custom: {
            errorMessage: 'password is required',
            options: (value) => {
                return value ? 1 : 0;
            }
        },
    },
});

const schemaGetPrivateKey = checkSchema({
    jsonFile: {
        in: 'body',
        custom: {
            errorMessage: 'jsonFile is required',
            options: (value) => {
                return value ? 1 : 0;
            }
        },
    },
    password: {
        custom: {
            errorMessage: 'password is required',
            options: (value) => {
                return value ? 1 : 0;
            }
        },
    },
});


module.exports = (app, router) => {
    router.post('/accounts', schemaIndex, (req, res, next) => {
        try {
            let errors = req.validationErrors();

            if (errors) {
                return res.status(422).json({
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
                let login = req.body.login.toString(),
                    password = req.body.password.toString();

                let json = bitllejs.account.create(login, password);
                let jsonString = JSON.stringify(json);

                res.status(200).send({jsonFile: jsonString});
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

    router.put('/accounts', schemaChangePassword, (req, res, next) => {
        try {
            let errors = req.validationErrors();

            if (errors) {
                return res.status(422).json({
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
                let jsonFile = req.body.jsonFile.toString(),
                    password = req.body.password.toString(),
                    oldpassword = req.body.oldpassword.toString();
                let json = JSON.parse(jsonFile);
                let newJson = bitllejs.account.changePassword(json, oldpassword, password);
                let jsonString = JSON.stringify(newJson);

                res.status(200).send({jsonFile: jsonString});
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

    router.post('/accounts/privatekey', schemaGetPrivateKey, (req, res, next) => {
        try {
            let errors = req.validationErrors();

            if (errors) {
                return res.status(422).json({
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
                let jsonFile = req.body.jsonFile,
                    password = req.body.password;
                let json = JSON.parse(jsonFile);
                let privateKey = bitllejs.account.getPrivateKey(password, json);

                res.status(200).send({privateKey: privateKey});
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

    router.get('/accounts/:address/balance/:tokenAddr', schemaBalance, (req, res, next) => {
        try {
            let errors = req.validationErrors();

            if (errors) {
                return res.status(422).json({
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
                let address = req.params.address,
                    tokenAddr = req.params.tokenAddr;

                let balance = utils.checkBalanceByAddress(address, tokenAddr);

                res.status(200).send({balance});
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