import ServiceRunner from "@etclabscore/jade-service-runner-client";
import { EthereumJSONRPC, GetBlockByHashResult } from "@etclabscore/ethereum-json-rpc"; // <-- which one is it?
import { hexToNumber, dateToHex } from "@etclabscore/eserialize";

import { baz } from "./mymod";
import { setFlagsFromString } from "v8";

const client = new ServiceRunner({
  transport: {
    type: "http",
    port: 8002,
    host: "localhost",
  },
});

// Clients that we'll have service runner run for us.
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

interface starI {
  erpc: EthereumJSONRPC,
  gatekey: string,
  latestBlock: string,
  myBal: number,
  lastUpdate: Date,
}

const stars = {
  "goerli": {
    erpc: erpcGoerli,
    gatekey: "kotti",
    latestBlock: "0x0",
    myBal: 0,
    lastUpdate: new Date(),
  },
  "kotti": {
    erpc: erpcKotti,
    gatekey: "goerli",
    latestBlock: "0x0",
    myBal: 0,
    lastUpdate: new Date(),
  },
}

const getStar = (name: string) => {
  if (name == "kotti") {
    return stars.kotti;
  }
  return stars.goerli;
}

// Only need one address for both chains.
const myAddr = "0xf215e98b4f0c749fe9b78d0d4fa97ac7c9a4fe11";

const setupClients = async (environments: string[]) => {
  let thing1 = baz;
  console.log("Installing multi-geth v1.9.2");
  const result = await client.installService("multi-geth", "1.9.2");
  console.log("multi-geth", "1.9.2", "installed ok?", result);
  const promises = environments.map(async (env)=>{
      console.log("Setting up client:", env);
      return client.startService("multi-geth", "1.9.2", env);
  });
  return Promise.all(promises); // this is async, one big promise
};

const getBalance = async (environments: string[], addr: string) => {
    const promises = environments.map(async (k) => {
      getStar(k).erpc.eth_getBalance(addr, getStar(k).latestBlock)
        .then(async (res) => {
          if (res) {
            getStar(k).myBal = hexToNumber(res);
          }
        })
        .catch((err) => {
          console.log("get balance got error", err);
        })
        ;
    })
    return Promise.all(promises);
};

const logStatus = async () => {
  const now = new Date();
  console.log(now, Object.keys(stars).map((k) => {
    return {
      env: k,
      updated_nseconds_ago: new Date().getUTCSeconds() - getStar(k).lastUpdate.getUTCSeconds(),
      latest_block: hexToNumber(getStar(k).latestBlock),
      my_balance: getStar(k).myBal
    };
  }));
};

const pollLatestBlocks = async (environments: string[])  => {
  const promises = environments.map(async (k) => {
    getStar(k).erpc.eth_getBlockByNumber("latest", true)
      .then(async (br) => {
        const didup = await handleBlockResponse(k, br);
        if (didup) {
          getBalance(environments, myAddr)
            .then(logStatus)
            ;
        } else {
          // console.log(".");
        }
      })
      ;
  });
  return Promise.all(promises);
}

const handleBlockResponse = async (environment: string, blockResponse: GetBlockByHashResult) => {
  let didUpdate = false;
  if (blockResponse) {

    // We have a new block.
    if (blockResponse.number && blockResponse.number !== getStar(environment).latestBlock) {
      didUpdate = true;
      getStar(environment).lastUpdate = new Date();

      // Modify 'state'.
      getStar(environment).latestBlock = blockResponse.number;

      let txs = blockResponse.transactions;
      if (txs) {
        // console.log(environment, "tranactions length", txs.length);
      }
    }
  }
  return didUpdate;
};

const exec = async () => {
  await setupClients(Object.keys(stars)); // this will actually wait promises return

  setInterval(() => {
    pollLatestBlocks(Object.keys(stars));
  }, 1000);

 };

exec().then(() => {
  console.log("Exec finished without errors");
}).catch((err) => {
  console.log("Exec got error:", err);
});
