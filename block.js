var SHA256 = require("crypto-js/sha256");

module.exports = class Block {
  constructor(timestamp = Date.now(), transactions = [], previousHash = "") {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.getBlockHash();
  }

  getBlockHash() {
    return SHA256(
      this.timestamp +
        JSON.stringify(this.transactions) +
        this.previousHash +
        this.nonce
    ).toString();
  }

  getTransactionsInBlock() {
    return this.transactions;
  }

  mine(difficulty) {
    while (!this.hash.startsWith(Array(difficulty + 1).join("0"))) {
      this.nonce++;
      this.hash = this.getBlockHash();
    }
  }
};
