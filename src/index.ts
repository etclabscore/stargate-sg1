import ServiceRunner from "@etclabscore/jade-service-runner-client";
import { EthereumJSONRPC, GetBlockByHashResult } from "@etclabscore/ethereum-json-rpc"; // <-- which one is it?
import { hexToNumber, dateToHex } from "@etclabscore/eserialize";
import { StarClass } from "./star";
import { setFlagsFromString } from "v8";
import {Options} from "@etclabscore/ethereum-json-rpc/build";
import {type} from "os";
import * as path from "path";

// const exec = require('child_process').exec; //, child;

const client = new ServiceRunner({
  transport: {
    type: "http",
    port: 8002,
    host: "localhost",
  },
});

// // Clients that we'll have service runner run for us.
// const erpcKottiOpts = ;
//
// const erpcGoerliOpts = ;

// Only need one address for both chains.
const myAddr = "0xf215e98b4f0c749fe9b78d0d4fa97ac7c9a4fe11";

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

const logStatus = (sc: StarClass) => {
  // tslint:disable-next-line:no-console
  console.log(sc.name, sc.latestBlock ? sc.latestBlock.number : "?", "bal", sc.gateAddressBalance);
}

const exec = async () => {
  await setupClients(["goerli", "kotti"]);

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

  starGoerli.onBlockDidUpdate((foo) => starGoerli.getAddressBalance());
  starGoerli.onBlockDidUpdate(logStatus);
  starGoerli.doPoll(starGoerli.setStateFromClient, 1000);

  starKotti.onBlockDidUpdate((foo) => starKotti.getAddressBalance());
  starKotti.onBlockDidUpdate(logStatus);
  starKotti.doPoll(starKotti.setStateFromClient, 1000);

 };

exec().then(() => {
  // tslint:disable-next-line:no-console
  console.log("Exec finished without errors");
}).catch((err) => {
  // tslint:disable-next-line:no-console
  console.log("Exec got error:", err);
});
