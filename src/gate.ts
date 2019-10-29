import {StarClass} from "./star";
import {hexToNumber} from "@etclabscore/eserialize";

export interface IGateCredit {
  fromClient: StarClass;
  sender: string;
  value: string;
}

const getOutstandingCredits = (client: StarClass, addr: string): IGateCredit[] => {
  const block = client.latestBlock;
  const credits: IGateCredit[] = [];

  if (!block || !block.transactions) {
    return [];
  }

  for (let i = 0; i < block.transactions.length; i++) {
    const t = block.transactions[i];
    if (t !== null) {
      if (typeof t === "string") {
        client.getTransaction(t)
          .then((tx) => {
            if (tx) {
              if (addr === tx.to) {
                credits.push({
                  fromClient: client,
                  sender: tx.from || "",
                  value: tx.value || "",
                });
              }
            }
          });
      } else {
        // testing/development:
        if (t.to && t.to.length > 3 && hexToNumber(t.value!) < 100000000000000 && t.from!.toLowerCase() !== addr.toLowerCase()) {
        // if (addr === t.to) {
          credits.push({
            fromClient: client,
            sender: t.from || "",
            value: t.value || "",
          });
        }
      }
    }
  }

  return credits;
}

export default {
  getOutstandingCredits,
};
