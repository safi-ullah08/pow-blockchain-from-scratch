const Blockchain = require("./chain");
const Transaction = require("./transaction");
const Block = require("./block");
const { getBalance } = require("./utils");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");
const Wallet = require("./wallet");
const testChain = new Blockchain();

const MINTING_PRIVATE_KEY =
  "c1abaf178d2a6f5e088920397f51c56fefb61b4f20b7a7804934ca5f34b6c5eb";

const MINTING_KEY = ec.keyFromPrivate(MINTING_PRIVATE_KEY, "hex");

const MINTING_PUBLIC_KEY = MINTING_KEY.getPublic("hex");

let tokenSeller = new Wallet(MINTING_KEY, MINTING_PUBLIC_KEY);

let bobsKeyPair = ec.genKeyPair();

let bobsPublicKey = bobsKeyPair.getPublic("hex");

let BOB = new Wallet(bobsKeyPair, bobsPublicKey);

let aliceKeyPair = ec.genKeyPair();

let alicePublicKey = aliceKeyPair.getPublic("hex");

let ALICE = new Wallet(aliceKeyPair, alicePublicKey);

console.log(
  "Amount of tokens in token sellers wallet: ",
  getBalance(testChain.chain, MINTING_PUBLIC_KEY)
);

// BOB Buys 50 tokens from token Seller
let bobsTranasaction = new Transaction(
  tokenSeller.address,
  BOB.address,
  50,
  100
);

bobsTranasaction.signTransaction(tokenSeller.sign(bobsTranasaction.hash));

testChain.addTransaction(bobsTranasaction);

// Alice Buys 100 tokens from token Seller
let alicessTranasaction = new Transaction(
  tokenSeller.address,
  ALICE.address,
  100,
  100
);

alicessTranasaction.signTransaction(tokenSeller.sign(alicessTranasaction.hash));

testChain.addTransaction(alicessTranasaction);

block = new Block();

testChain.addNewBlock(block);

console.log("The Chain ", testChain.chain);

console.log("The Transactions in the chain ", testChain.chain[1].transactions);

console.log(
  "Amount of tokens in token sellers wallet: ",
  getBalance(testChain.chain, MINTING_PUBLIC_KEY)
);

console.log(
  "Amount of tokens in bobs wallet: ",
  getBalance(testChain.chain, BOB.address)
);

console.log(
  "Amount of tokens in alice wallet: ",
  getBalance(testChain.chain, alicePublicKey)
);
