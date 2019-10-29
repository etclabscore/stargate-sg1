#!/usr/bin/env bash

set -e

source ./clef-config.sh

init_clef(){
  echo "Initializing clef..."

  echo "Making directory: $CLEF_CONFIG_DIR"
  mkdir "$CLEF_CONFIG_DIR"
  clef \
    --configdir "$CLEF_CONFIG_DIR" \
    init

  # https://github.com/ethereum/go-ethereum/blob/master/cmd/clef/tutorial.md#advanced-rules
  echo "Setting password for address: $CLEF_MY_ADDRESS"
  clef \
    --configdir "$CLEF_CONFIG_DIR" \
    --keystore "$CLEF_KEYSTORE_DIR" \
    setpw $CLEF_MY_ADDRESS

  # https://github.com/ethereum/go-ethereum/blob/master/cmd/clef/tutorial.md#automatic-rules
  rules_file_hash="$(sha256sum $CLEF_RULES_FILE)"
  echo "Attesting clef rules file ($CLEF_RULES_FILE) with sha256: $rules_file_hash"
  clef \
    --configdir "$CLEF_CONFIG_DIR" \
    attest $rules_file_hash
}
