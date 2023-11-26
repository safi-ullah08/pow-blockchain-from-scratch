const Block = require("./block");
const Transaction = require("./transaction");
const Wallet = require("./wallet");
const { getBalance } = require("./utils");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

const MINTING_PRIVATE_KEY =
  "c1abaf178d2a6f5e088920397f51c56fefb61b4f20b7a7804934ca5f34b6c5eb";

const MINTING_KEY = ec.keyFromPrivate(MINTING_PRIVATE_KEY, "hex");

const MINTING_PUBLIC_KEY = MINTING_KEY.getPublic("hex");

module.exports = class Blockchain {
  constructor() {
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.chain = [this.generateGensisBlock()];
  }

  generateGensisBlock() {
    let transaction = new Transaction("", MINTING_PUBLIC_KEY, 10000000, 0);
    let wallet = new Wallet(MINTING_KEY, MINTING_PUBLIC_KEY);
    let sig = wallet.sign(transaction.hash);
    transaction.signTransaction(sig);
    let block = new Block(Date.now(), [transaction], "");
    return block;
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addTransaction(transaction) {
    if (transaction.isValid(getBalance(this.chain, transaction.from))) {
      this.pendingTransactions.push(transaction);
    } else {
      throw new Error("Invlaid Transaction!!");
    }
  }

  addMintingTransaction(transaction) {
    if (
      transaction.from === MINTING_PUBLIC_KEY &&
      transaction.to === MINTING_PUBLIC_KEY &&
      this.chain == undefined
    ) {
      this.pendingTransactions.push(transaction);
    }
  }

  addNewBlock(block) {
    block.previousHash = this.getLatestBlock().hash;
    block.hash = block.getBlockHash();
    block.mine(this.difficulty);
    block.transactions = this.pendingTransactions;
    this.chain.push(Object.freeze(block));
    this.pendingTransactions = [];
  }

  isChainValid() {}
};
