# stargate-sg1

Demonstrating basic "Stargate" cross-chain interactions with https://github.com/etclabscore/jade-service-runner.

This is a proof of concept that will:

- boot kotti
- boot goerli
- listen for transaction on kotti
- make transaction on goerli
- vice versa

### Develop

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
