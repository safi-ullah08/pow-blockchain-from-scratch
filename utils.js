const getBalance = (chain, address) => {
  let balance = 0;
  for (const block of chain) {
    for (i = 0; i < block.transactions.length; i++) {
      if (block.transactions[i].to == address) {
        balance += block.transactions[i].amount;
      }
      if (block.transactions[i].from == address) {
        balance -= block.transactions[i].amount + block.transactions[i].gas;
      }
    }
  }
  return balance;
};

module.exports = { getBalance };
