# stargate-sg1

> Scaling without gimmicks

> A Stargate is a server side application that listens for incoming transactions on one chain and sends a complimentary transaction on the other chain. 

> https://medium.com/@DontPanicBurns/the-blockchain-stargate-366a7a72822e

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

### Contributing

How to contribute, build and release are outlined in [CONTRIBUTING.md](CONTRIBUTING.md), [BUILDING.md](BUILDING.md) and [RELEASING.md](RELEASING.md) respectively. Commits in this repository follow the [CONVENTIONAL_COMMITS.md](CONVENTIONAL_COMMITS.md) specification.
