import ServiceRunner from "@etclabscore/jade-service-runner-client";
import { EthereumJSONRPC, GetBlockByHashResult } from "@etclabscore/ethereum-json-rpc"; // <-- which one is it?
import { hexToNumber, numberToHex } from "@etclabscore/eserialize";
import { StarClass } from "./star";
import { TxSigner } from "./txsigner";
import gate, {IGateCredit} from "./gate";
// const exec = require('child_process').exec; //, child;

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
    path: "multi-geth/goerli/1.9.2",
  },
}, myAddr);

const starKotti = new StarClass("kotti", {
  transport: {
    host: "localhost",
    port: 8002,
    type: "http",
    path: "multi-geth/kotti/1.9.2",
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
  const credits = gate.getOutstandingCredits(readStar, myAddr);
  if (credits.length === 0) {
    // tslint:disable-next-line:no-console
    console.log(readStar.name, "No managed transaction found. Returning.");
  }
  for (let i = 0; i < credits.length; i++) {
    const signedTransaction = await getSigningStar(writeStar.name).signTransaction({
      to: credits[i].sender,
      from: myAddr,
      value: credits[i].value,
      nonce: numberToHex(writeStar.gateAddressNonce + 1),
      gas: numberToHex(200000),
      gasPrice: numberToHex(60 * Math.pow(10, 9)), // 60 Gwei should be _plenty_
    });
    writeStar.sendRawTransaction(signedTransaction);
  }
}

const exec = async () => {
  await setupClients(["goerli", "kotti"]);

  // tslint:disable-next-line:no-console
  console.log("Command did set by args:",
    "goerli signer port=", starGoerli.signerHTTPPort,
    "kotti signer port=", starKotti.signerHTTPPort);

  starGoerli.onBlockDidUpdate((foo) => starGoerli.getAddressBalance());
  starGoerli.onBlockDidUpdate((foo) => manageGatedTransactions(starGoerli, starKotti));
  starGoerli.onBlockDidUpdate(logStatus);
  starGoerli.doPoll(() => starGoerli.setStateFromClient(), 1000);

  starKotti.onBlockDidUpdate((foo) => starKotti.getAddressBalance());
  starGoerli.onBlockDidUpdate((foo) => manageGatedTransactions(starKotti, starGoerli));
  starKotti.onBlockDidUpdate(logStatus);
  starKotti.doPoll(() => starKotti.setStateFromClient(), 1000);
};

const logStatus = (sc: StarClass) => {
  // tslint:disable-next-line:no-console
  console.log(":", sc.name, "latest block", sc.latestBlock
    ? hexToNumber(sc.latestBlock.number || "")
    : "?", "bal", sc.gateAddressBalance);
};

exec().then(() => {
  // tslint:disable-next-line:no-console
  console.log("Exec finished without errors");
}).catch((err) => {
  // tslint:disable-next-line:no-console
  console.log("Exec got error:", err);
});
