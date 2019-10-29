import {StarClass} from "./star";
import {hexToNumber, numberToHex} from "@etclabscore/eserialize";
import {ITransactionData} from "./txsigner";
import {ObjectUAh7GW7V as ITransaction} from "@etclabscore/ethereum-json-rpc";

// stargatedTransaction handles assembling a "transposed" stargate:send transaction
// from a stargate:received transaction.
const stargatedTransaction = (readClient: StarClass,
                              writeClient: StarClass,
                              tx: ITransaction,
                              i: number): ITransactionData => {

  // tslint:disable-next-line:no-console
  console.log("<-", readClient.name, "from", tx.from, "value", tx.value);
  return {
    from: writeClient.gateAddress,
    to: tx.to,
    value: tx.value,
    input: tx.input,
    data: tx.data,
    gas: tx.gas,
    gasPrice: tx.gasPrice,
    nonce: numberToHex(writeClient.gateAddressNonce + i),
  };
};

const stargateRequirements = (client: StarClass, stargateAddress: string, tx: ITransaction): boolean => {
  if (!tx) { return false; }

  // if (stargateAddress !== tx.to) { return false; }
  if (stargateAddress.toLowerCase() === tx.from!.toLowerCase()) { return false; }
  if (hexToNumber(tx.value!) > 100000000000000) { return false; }

  // Ensure financial solvency.
  if (hexToNumber(tx.value!) > client.gateAddressBalance) {
    // tslint:disable-next-line:no-console
    console.log("They're running on the bank! Close up the doors!");
    return false;
  }
  if (hexToNumber(tx.gasPrice) * hexToNumber(tx.gas) >= client.gateAddressBalance) {
    // tslint:disable-next-line:no-console
    console.log("Bank gone bust. Close up the doors!");
    return false;
  }

  // Add your custom logic in and around here...

  return true;
};

// getOutstandingCredits is responsible for parsing transactions
// to find ones that should be stargated.
const getOutstandingTransactions = (readClient: StarClass,
                                    writeClient: StarClass,
                                    addr: string): ITransactionData[] => {

  const block = readClient.latestBlock;
  const credits: ITransactionData[] = [];

  if (!block || !block.transactions) {
    return credits;
  }

  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < block.transactions.length; i++) {
    const t = block.transactions[i];
    if (t !== null) {
      if (typeof t === "string") {
        readClient.getTransaction(t)
          .then((tx) => {
            if (tx) {
              if (stargateRequirements(readClient, addr, tx)) {
                credits.push(stargatedTransaction(readClient, writeClient, tx, credits.length));
              }
            }
          });
      } else {
        if (stargateRequirements(readClient, addr, t)) {
          credits.push(stargatedTransaction(readClient, writeClient, t, credits.length));
        }
      }
    }
  }
  return credits;
};

export default {
  getOutstandingTransactions,
};
