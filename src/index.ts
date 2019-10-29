import ServiceRunner from "@etclabscore/jade-service-runner-client";
import { hexToNumber, numberToHex } from "@etclabscore/eserialize";
import { StarClass } from "./star";
import { TxSigner } from "./txsigner";
import gate from "./gate";

const client = new ServiceRunner({
  transport: {
    type: "http",
    port: 8002,
    host: "localhost",
  },
});

const setupClients = async (environments: string[]) => {
  // tslint:disable-next-line:no-console
  console.log("Installing multi-geth v1.9.2");
  const result = await client.installService("multi-geth", "1.9.2");
  // tslint:disable-next-line:no-console
  console.log("multi-geth", "1.9.2", "installed ok?", result);
  const promises = environments.map(async (env) => {
    // tslint:disable-next-line:no-console
      console.log("Setting up client:", env);
      return client.startService("multi-geth", "1.9.2", env);
  });
  return Promise.all(promises); // this is async, one big promise
};

// Only need one address for both chains.
const myAddr = "0xf215e98b4f0c749fe9b78d0d4fa97ac7c9a4fe11";

const starGoerli = new StarClass("goerli", {
  transport: {
    host: "localhost",
    port: 8002,
    type: "http",
    path: "multi-geth/goerli2/1.9.2",
  },
}, myAddr);

const starKotti = new StarClass("kotti", {
  transport: {
    host: "localhost",
    port: 8002,
    type: "http",
    path: "multi-geth/kotti2/1.9.2",
  },
}, myAddr);

const starSigners = {
  goerli: new TxSigner({
    transport: {
      host: "localhost",
      port: parseInt(process.argv[2], 10),
      type: "http",
    },
  }),
  kotti: new TxSigner({
    transport: {
      host: "localhost",
      port: parseInt(process.argv[3], 10),
      type: "http",
    },
  }),
};

const getSigningStar = (name: string) => {
  if (name === "goerli") {
    return starSigners.goerli;
  }
  return starSigners.kotti;
};

const manageGatedTransactions = async (readStar: StarClass, writeStar: StarClass) => {
  if (readStar.syncing) {
    return;
  }
  const credits = gate.getOutstandingCredits(readStar, myAddr);
  if (credits.length === 0) {
    // tslint:disable-next-line:no-console
    console.log("@", readStar.name, "No managed transaction found. Returning.");
  }
  for (let i = 0; i < credits.length; i++) {
    if (hexToNumber(credits[i].value) > writeStar.gateAddressBalance) {
      // tslint:disable-next-line:no-console
      console.log("They're running on the bank! Close up the doors!");
      process.exit(42);
    }
    // tslint:disable-next-line:no-console
    console.log("<-", readStar.name, "from", credits[i].sender, "value", hexToNumber(credits[i].value))
    const data = {
      from: myAddr,
      to: credits[i].sender,
      value: credits[i].value,
      nonce: numberToHex(writeStar.gateAddressNonce + i),
      gas: numberToHex(21000),
      gasPrice: numberToHex(60000000000),
    };
    // tslint:disable-next-line:no-console
    console.log("->", writeStar.name, "corresponding write tx", data);
    const signedTransaction = await getSigningStar(writeStar.name).signTransaction(data);
    // tslint:disable-next-line:no-console
    console.log("->", writeStar.name, "signed write tx", signedTransaction);
    writeStar.sendRawTransaction(signedTransaction)
      .then((txhash) => {
        // tslint:disable-next-line:no-console
        console.log("->", writeStar.name, "posted write tx.hash:", txhash);
      })
      // tslint:disable-next-line:no-console
      .catch((err) => console.log("->", writeStar.name, "send tx error:", err.toString().split("\n")[0]));
  }
};

const exec = async () => {
  await setupClients(["goerli2", "kotti2"]);

  if (starSigners.goerli.port === 0) {
    // tslint:disable-next-line:no-console
    console.log("Invalid signing port passed to Goerli signer config (ARG 1)");
    process.exit(1);
  }
  if (starSigners.kotti.port === 0) {
    // tslint:disable-next-line:no-console
    console.log("Invalid signing port passed to Kotti signer config (ARG 2)");
    process.exit(1);
  }

  // tslint:disable-next-line:no-console
  console.log("Command did set by args:",
    "goerli signer port=", starSigners.goerli.port,
    "kotti signer port=", starSigners.kotti.port);

  starGoerli.onBlockDidUpdate(logStatus);
  starGoerli.onBlockDidUpdate((foo) => manageGatedTransactions(starGoerli, starKotti));
  starGoerli.doPoll(() => starGoerli.setStateFromClient(), 1000);

  starKotti.onBlockDidUpdate(logStatus);
  starKotti.onBlockDidUpdate((foo) => manageGatedTransactions(starKotti, starGoerli));
  starKotti.doPoll(() => starKotti.setStateFromClient(), 1000);
};

const logStatus = (sc: StarClass) => {
  // tslint:disable-next-line:no-console
  if (sc.syncing) {
    console.log(":", sc.name, "syncing...");
  } else {
    console.log(":", sc.name, "latest block", sc.latestBlock
      ? hexToNumber(sc.latestBlock.number || "")
      : "?", "block.txsN", sc.latestBlock ? sc.latestBlock.transactions!.length : -1, "bal", sc.gateAddressBalance);
  }
};

exec().then(() => {
  // tslint:disable-next-line:no-console
  console.log("Exec finished without errors");
}).catch((err) => {
  // tslint:disable-next-line:no-console
  console.log("Exec got error:", err);
});
