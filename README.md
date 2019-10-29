# stargate-sg1

> __Scaling without gimmicks__
> 
> ... A Stargate is a server side application that listens for incoming transactions on one chain and sends a complimentary transaction on the other chain. 
>
> https://medium.com/@DontPanicBurns/the-blockchain-stargate-366a7a72822e

![gif](https://miro.medium.com/max/500/1*kMj5jSrsMRUIyhylR9ic2A.gif)

This prototype app brings the above cited idea to life, made Very Simple :tm: by using
 
- [etclabscore/multi-geth](https://github.com/etclabscore/multi-geth),
- [etclabscore/jade-service-runner](https://github.com/etclabscore/jade-service-runner), and 
- [etclabscore/ethereum-json-rpc-specification](https://github.com/etclabscore/ethereum-json-rpc-specification).

The typescript application you'll find in [src/](./src/) is a proof of concept that will:

- Install multi-geth
- Boot `goerli` and sync
- Boot `kotti` and sync
- Listen for transactions to "our" address on either chain
- Make a complimentary transaction (transposing sender and recipient) on the opposite chain

### Develop/Run

```shell
<Terminal 0> $ jade-service-runner
<Terminal 1> $ ./clef-start.sh 5 # Goerli chain id
# => Read the http port that will automatically assigned to this clef process.
<Terminal 2> $ ./clef-start.sh 6 # Kotti chain id
# => Read the http port that will automatically assigned to this clef process.
<Terminal 3> $ npm run start <Goerli HTTP Clef port> <Kotti HTTP Clef port>
```

You should see something like this:
```shell
Installing multi-geth v1.9.2
multi-geth 1.9.2 installed ok? true
Setting up client: goerli2
Setting up client: kotti2
Command did set by args: goerli signer port= 43365 kotti signer port= 46675
Exec finished without errors
: kotti latest block 1458358 block.txsN 0 bal 1000042
@ kotti No managed transaction found. Returning.
: goerli latest block 1555942 block.txsN 3 bal 1000042
...
: goerli latest block 1556026 block.txsN 0 bal 2460940000000000000
@ goerli No managed transaction found. Returning.
: kotti latest block 1458443 block.txsN 0 bal 102074119980000000000
@ kotti No managed transaction found. Returning.
: goerli latest block 1556027 block.txsN 1 bal 2460940000000000000
<- goerli from 0x525615ef00c36da45cf3b1d73947af4da51634bc value 0
-> kotti corresponding write tx {
  from: '0xf215e98b4f0c749fe9b78d0d4fa97ac7c9a4fe11',
  to: '0x525615ef00c36da45cf3b1d73947af4da51634bc',
  value: '0x0',
  nonce: '0x152',
  gas: '0x5208',
  gasPrice: '0xdf8475800'
}
-> kotti signed write tx 0xf866820152850df847580082520894525615ef00c36da45cf3b1d73947af4da51634bc80802fa019c14ccb8d07f85087bf12d44030bbaef56d9d47c3aa2ec5a9ac3cfe5d00e138a0535b77fe28b2f2465cb55ffcca68f8a058817f905a7697456bdbe26ce18a954f
-> kotti posted write tx.hash: 0x64306800debebc57b38c35d854a17681a93f88cf436717e38777391bfd80cc78
```

### Contributing

How to contribute, build and release are outlined in [CONTRIBUTING.md](CONTRIBUTING.md), [BUILDING.md](BUILDING.md) and [RELEASING.md](RELEASING.md) respectively. Commits in this repository follow the [CONVENTIONAL_COMMITS.md](CONVENTIONAL_COMMITS.md) specification.
