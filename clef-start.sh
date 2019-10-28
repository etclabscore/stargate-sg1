#!/usr/bin/env bash

# Goerli chainid = 5
# Kotti chainid = 6

source ./clef-config.sh
source ./clef-setup.sh

chainid="$1"

[[ -z "$chainid" ]] && { echo "Please provide a chain id as ARG1."; exit 1; }

# https://unix.stackexchange.com/a/132524/273201
any_available_port(){
  python -c 'import socket; s=socket.socket(); s.bind(("", 0)); print(s.getsockname()[1]); s.close()'
}

port=$(any_available_port)
echo "Starting clef for chain id: $chainid ..."
echo " -> Will run HTTP JSON-RPC on port: $port"

clef \
  --chainid $chainid \
  --configdir "$CLEF_CONFIG_DIR" \
  --keystore "$CLEF_KEYSTORE_DIR" \
  --rules "$CLEF_RULES_FILE" \
  --nousb \
  --ipcdisable \
  --rpc \
  --rpcport $port \
  --loglevel 5
