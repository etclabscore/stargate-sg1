import EthereumJSONRPC, {
  GetBalanceResult,
  GetBlockByNumberResult,
  ObjectW9HVodO0, Options,
} from "@etclabscore/ethereum-json-rpc";

import {hexToNumber} from "@etclabscore/eserialize";

export class StarClass {
  public name: string;
  public gateAddress: string;

  // tslint:disable-next-line:variable-name
  public gateAddressBalance: number = 0;
  // tslint:disable-next-line:variable-name
  // tslint:disable-next-line:variable-name
  public latestBlock!: GetBlockByNumberResult;
  // tslint:disable-next-line:variable-name
  private erpc: EthereumJSONRPC;

  private mustGetLatestBlockNumber(): string {
    if (this.latestBlock) {
      return this.latestBlock.number || "0x0";
    }
    return "0x0";
  }

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
    setInterval(cb, interval);
  }

  public setStateFromClient() {
    this.erpc.eth_getBlockByNumber("latest", true)
      .then((foo) => this.handleLatestBlock(foo));
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
