import fetch from "node-fetch";

// TODO: This could probably be refactored to use an interface imported
// from @etclabscore/ethereum-json-rpc instead of rolling our own.
export interface ITransactionData {
  to?: string;
  from: string;
  value?: string;
  nonce: string;
  gas: string;
  gasPrice: string;
  input?: string;
  data?: string;
}

interface IOptions {
  transport: {
    type: "websocket" | "http" | "https";
    host: string;
    port: number;
  };
}

export class TxSigner {
  public transport: string = "http";
  public host: string = "localhost";
  public port: number = 5450;

  // 'id' for JSON RPC POST
  private callid: number = 1;

  constructor(opts: IOptions) {
    this.transport = opts.transport.type;
    this.port = opts.transport.port;
    this.host = opts.transport.host;
  }

  public async signTransaction(data: ITransactionData): Promise<string> {
    const rpcCall = {
      id: ++this.callid,
      jsonrpc: "2.0",
      method: "account_signTransaction",
      params: [data],
    };
    const result = await fetch(this.transport + "://" + this.host + ":" + this.port, {
      method: "POST",
      body:    JSON.stringify(rpcCall),
      headers: { "Content-Type": "application/json" },
    });
    const got = await result.json();
    let returnable = "";
    if (got.result && got.result.raw) {
      returnable = got.result.raw;
    } else if (got.error) {
      throw new Error(got.error.message);
    }
    return returnable;
  }
}
