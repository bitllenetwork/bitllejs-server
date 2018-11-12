const BitlleJs = require('bitllejs');
const ethUtil = require('ethereumjs-util');
const request = require('request');
const leftPad = require('left-pad');
const config = require('../../config/config');

const bitllejs = new BitlleJs();
bitllejs.web3.setProvider(new bitllejs.web3.providers.HttpProvider(config.rpc[1]));//'http://localhost:8545'

const Utils = {
    getSender: (privateKey) => {
        let privateKeyBuffer = new Buffer(privateKey.slice(2), 'hex');
        return ethUtil.toChecksumAddress(ethUtil.privateToAddress(privateKeyBuffer).toString('hex'));
    },
    getContract: (tokenAddr) => {
        return bitllejs.web3.eth.contract(bitllejs.contracts.abi.LT).at(tokenAddr);
    },
    checkBalance: (amount, tokenAddr, privateKey) => {
        let senderAddr = Utils.getSender(privateKey);
        let contract = Utils.getContract(tokenAddr);

        let balance = contract.balanceOf(senderAddr);
        if (balance.minus(amount) < 0) {
            throw new Error('Insufficience balance (balance: ' + bitllejs.web3.fromWei(balance).toString() + ', need: ' + bitllejs.web3.fromWei(amount).toString() + ')');
        }
    },
    checkBalanceByAddress: (address, tokenAddr) => {
        let senderAddr = address;
        let contract = Utils.getContract(tokenAddr);

        let balance = contract.balanceOf(senderAddr);

        return bitllejs.web3.fromWei(balance);
    },
    getAccessToken: (authorization) => {
        if (!authorization) {
            throw new Error('Your request was made with invalid credentials.', 100);
        }
        else {
            let authorization1 = authorization.split(' ');

            if (!authorization1[1]) {
                throw new Error('Your request was made with invalid credentials.');
            }
            else {
                return authorization1[1];
            }
        }
    },
    getFee: () => {
        return {
            fee: "0.01",
            feeMin: "0.01"
        };
    },
    NumTo32byteLength: function (value) {
        return leftPad(bitllejs.web3.toHex(value).slice(2), 64, 0);
    },
    to32byteLength: (val) => {
        val = bitllejs.web3.toBigNumber(val);
        return leftPad((val).toString(16), 64, 0);
    },
};

module.exports = Utils;