import EthereumJSONRPC, {
  GetBalanceResult,
  GetBlockByNumberResult,
  Options,
} from "@etclabscore/ethereum-json-rpc";

import {hexToNumber} from "@etclabscore/eserialize";
import {
  NonceOrNull,
  ObjectQN4RqE6Z,
  OneOf08Ts8ZCB,
  OneOf5ZIsDKft,
  StringQvf80GFh
} from "@etclabscore/ethereum-json-rpc/build";

export class StarClass {

  public name: string;

  // tslint:disable-next-line:variable-name
  public gateAddress: string;
  public gateAddressBalance: number = 1000042;
  public gateAddressNonce: number = 1000042;

  // tslint:disable-next-line:variable-name
  // tslint:disable-next-line:variable-name
  public latestBlock!: GetBlockByNumberResult;
  public syncing: boolean = true;
  public signerHTTPPort: number = 0;

  // tslint:disable-next-line:variable-name
  private erpc: EthereumJSONRPC;

  // tslint:disable-next-line:variable-name
  private _blockDidUpdate: Array<(c: StarClass) => void> = [];

  constructor(name: string, erpcOpts: Options, address: string) {
    this.name = name;
    this.erpc = new EthereumJSONRPC(erpcOpts);
    this.gateAddress = address;
  }

  public onBlockDidUpdate(cb: (sc: StarClass) => void) {
    this._blockDidUpdate.push(cb);
  }

  // tslint:disable-next-line:align no-unused-expression
  public doPoll(cb: () => void, interval: number) {
    return setInterval(cb, interval);
  }

  public setStateFromClient() {
    this.erpc.eth_getBlockByNumber("latest", true)
      .then((foo) => this.handleLatestBlock(foo))
      .then(() => {
        this.erpc.eth_getBalance(this.gateAddress, this.latestBlock ? this.latestBlock.number || "0x0" : "0x0")
          .then((foo) => this.handleBalanceResult(foo))
          .catch((err) => {
            // tslint:disable-next-line:no-console
            console.log("error/eth_getBalance", err);
          });
        this.erpc.eth_getTransactionCount(this.gateAddress, this.latestBlock ? this.latestBlock.number || "0x0" : "0x0")
          .then((foo) => this.handleGateAddressTransactionCount(foo))
          .catch((err) => {
            // tslint:disable-next-line:no-console
            console.log("error/eth_getTransactionCount", err);
          });
      })
      .catch((err) => {
        // tslint:disable-next-line:no-console
        console.log("error/eth_getBlockByNumber", err);
      });
    if (this.syncing) {
      this.erpc.eth_syncing()
        .then((foo) => this.handleSyncingResult(foo));
      return;
    }
  }

  public sendRawTransaction(hash: string) {
    // tslint:disable-next-line:no-console
    return this.erpc.eth_sendRawTransaction(hash);
  }

  public async getTransaction(hash: string) {
    return this.erpc.eth_getTransactionByHash(hash);
  }

  public async getTransactions(transactions: any[]) {
    const gotTransactions: OneOf08Ts8ZCB[] = [];
    await transactions.map((tx) => {
      this.erpc.eth_getTransactionByHash(tx)
        .then((txh) => {
          gotTransactions.push(txh);
        })
      ;
    });
    return gotTransactions;
  }

  private handleBalanceResult(res: GetBalanceResult) {
    if (res) {
      this.gateAddressBalance = hexToNumber(res);
    }
  }

  private handleSyncingResult(res: OneOf5ZIsDKft) {
    if (typeof res === "object") {
      this.syncing = true;
    } else {
      this.syncing = false;
    }
  }

  private handleGateAddressTransactionCount(res: NonceOrNull) {
    if (res !== null) {
      this.gateAddressNonce = hexToNumber(res);
    }
  }

  private handleLatestBlock(res: GetBlockByNumberResult) {
    if (res) {
      const oldB = this.latestBlock;
      this.latestBlock = res;
      if (!oldB || (oldB.number !== res.number)) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this._blockDidUpdate.length; i++) {
          this._blockDidUpdate[i](this);
        }
      }
    }
  }
}
