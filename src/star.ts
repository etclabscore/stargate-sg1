import EthereumJSONRPC, {
  GetBalanceResult,
  GetBlockByNumberResult,
  Options,
} from "@etclabscore/ethereum-json-rpc";

import {hexToNumber} from "@etclabscore/eserialize";
import {NonceOrNull, OneOf08Ts8ZCB, StringQvf80GFh} from "@etclabscore/ethereum-json-rpc/build";

export class StarClass {

  public name: string;
  public gateAddress: string;

  // tslint:disable-next-line:variable-name
  public gateAddressBalance: number = 0;
  public gateAddressNonce: number = 0;

  // tslint:disable-next-line:variable-name
  // tslint:disable-next-line:variable-name
  public latestBlock!: GetBlockByNumberResult;

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
      .then((foo) => this.handleLatestBlock(foo));
    this.erpc.eth_getTransactionCount(this.gateAddress, "latest")
      .then((foo) => this.handleGateAddressTransactionCount(foo));
  }

  public sendRawTransaction(hash: string) {
    // tslint:disable-next-line:no-console
    console.log(this.name, "eth_sendRawTransaction", hash);
    // this.erpc.eth_sendRawTransaction(hash);
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

  public async getAddressBalance() {
    try {
      const balance = await this.erpc.eth_getBalance(this.gateAddress, this.mustGetLatestBlockNumber());
      await this.handleBalanceResult(balance);
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.log("get bal error", err);
    }
  }

  private mustGetLatestBlockNumber(): string {
    if (this.latestBlock) {
      return this.latestBlock.number || "0x0";
    }
    return "0x0";
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

  private handleBalanceResult(res: GetBalanceResult) {
    if (res) {
      this.gateAddressBalance = hexToNumber(res);
    }
  }
}
