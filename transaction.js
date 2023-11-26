var SHA256 = require("crypto-js/sha256");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

module.exports = class Transaction {
  constructor(from, to, amount, gas) {
    this.from = from;
    this.to = to;
    this.amount = amount;
    this.gas = gas;
    this.signature = "";
    this.hash = this.getTransactionHash();
  }

  signTransaction(signature) {
    this.signature = signature;
  }
  getTransactionHash() {
    return SHA256(
      this.fromAddress + this.toAddress + this.amount + this.gas
    ).toString();
  }

  isValid(balance) {
    if (
      this.verifySignature(this.from, this.signature, this.hash) &&
      balance > this.amount + this.gas
    ) {
      return true;
    }
    return false;
  }

  verifySignature(publicKey, signature, messageHash) {
    let key = ec.keyFromPublic(publicKey, "hex");
    let verified = key.verify(messageHash, signature);
    return verified;
  }
};
