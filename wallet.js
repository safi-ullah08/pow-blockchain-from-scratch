const cryptoJS = require("crypto-js");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

module.exports = class Wallet {
  constructor(key, address) {
    this.key = key;
    this.address = address;
  }
  sign(transactionHash) {
    return ec.sign(transactionHash, this.key);
  }
};
