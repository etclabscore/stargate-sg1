import ServiceRunner from "@etclabscore/jade-service-runner-client";
import { EthereumJSONRPC } from "@etclabscore/ethereum-json-rpc"; // <-- which one is it?
import { hexToNumber } from "@etclabscore/eserialize";

import { baz } from "./mymod";

const client = new ServiceRunner({
  transport: {
    type: "http",
    port: 8002,
    host: "localhost",
  },
});

const erpcKotti = new EthereumJSONRPC({
  transport: {
    host: "localhost",
    port: 8002,
    type: "http",
    path: "multi-geth/kotti/1.9.2",
  },
});

const erpcGoerli = new EthereumJSONRPC({
  transport: {
    host: "localhost",
    port: 8002,
    type: "http",
    path: "multi-geth/goerli/1.9.2",
  },
});

const clients = {
  "goerli" : erpcGoerli,
  "kotti" : erpcKotti,
};

const setupClients = async (environments: string[]) => {
  let thing1 = baz;
  const result = await client.installService("multi-geth", "1.9.2");
  console.log("result"); //tslint:disable-line
  const promises = environments.map(async (env)=>{
      console.log("setting up env", env);
      return client.startService("multi-geth", "1.9.2", env);
  });
  return Promise.all(promises); // this is async, one big promise
};

const exec = async () => {
  await setupClients(Object.keys(clients)); // this will actually wait promises return
//  const balance = await clients.kotti.eth_getBalance("0xc1912fee45d61c87cc5ea59dae31190fffff232d", "0x0");
// use BigNumber.js I think to pull this back ~ npm install  @types/bignumber.js
// console.log(balance);
//  const txReciept = await clients.goerli.eth_sendRawTransaction(txHashKotti);

  let blockResponse = await clients.kotti.eth_getBlockByNumber("latest", false);
  if (blockResponse) {
    let n = blockResponse.number;
    if (n) {
      console.log("blockn", hexToNumber(n));
    }
  }
};

exec().then(() => {
  console.log("ok");
}).catch((err) => {
  console.log("got error", err);
});
