
#[macro_use]
extern crate jsonrpc_client_core;
use serde::{Serialize, Deserialize};

#[cfg(test)]
use autorand::Random;

#[cfg(test)]
mod test_harness;

use std::collections::HashMap;
pub type Address = String;
pub type Passphrase = String;
pub type DataToSign = String;
pub type Accounts = Vec<Option<UnknownXWwH5Alx>>;
pub type HideAccountResult = bool;
pub type UnhideAccountResult = bool;
pub type SignedTransaction = String;
pub type MnemonicPhrase = String;
pub type SignedMessageData = String;
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
#[cfg_attr(test, derive(Random))]
#[serde(untagged)]
pub enum Chain {
    #[serde(rename = "etc")]
    Etc,

    #[serde(rename = "morden")]
    Morden,
}
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
#[cfg_attr(test, derive(Random))]
#[serde(untagged)]
pub enum UnknownXWwH5Alx {
    AnythingArray(Vec<Option<serde_json::Value>>),

    Bool(bool),

    Double(f64),

    Integer(i64),

    String(String),

    UnknownXWwH5AlxClass(UnknownXWwH5AlxClass),
}
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
#[cfg_attr(test, derive(Random))]
pub struct Additional {
    /// chain name, by default etc, other possible variant morden.
    #[serde(rename = "chain")]
    pub chain: Option<Chain>,

    /// Chain id number, by default for mainnet it equals 61.
    #[serde(rename = "chain_id")]
    pub chain_id: Option<f64>,

    /// show hidden accounts
    #[serde(rename = "show_hidden")]
    pub show_hidden: Option<bool>,
}
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
#[cfg_attr(test, derive(Random))]
pub struct NewAccount {
    /// account description
    #[serde(rename = "description")]
    pub description: Option<String>,

    /// account name
    #[serde(rename = "name")]
    pub name: Option<String>,

    /// passphrase used to encode keyfile (recommend to use 8+ words with good entropy)
    #[serde(rename = "passphrase")]
    pub passphrase: Option<String>,
}
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
#[cfg_attr(test, derive(Random))]
pub struct TypedData {
    #[serde(rename = "domain")]
    pub domain: HashMap<String, Option<serde_json::Value>>,

    #[serde(rename = "message")]
    pub message: HashMap<String, Option<serde_json::Value>>,

    #[serde(rename = "primaryType")]
    pub primary_type: String,

    #[serde(rename = "types")]
    pub types: HashMap<String, Vec<Option<serde_json::Value>>>,
}
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
#[cfg_attr(test, derive(Random))]
pub struct Transaction {
    /// The data field sent with the transaction
    #[serde(rename = "data")]
    pub data: Option<String>,

    /// Address of the sender
    #[serde(rename = "from")]
    pub from: String,

    /// The gas limit provided by the sender in Wei
    #[serde(rename = "gas")]
    pub gas: String,

    /// The gas price willing to be paid by the sender in Wei
    #[serde(rename = "gasPrice")]
    pub gas_price: String,

    /// The total number of prior transactions made by the sender
    #[serde(rename = "nonce")]
    pub nonce: String,

    /// address of the receiver. null when its a contract creation transaction
    #[serde(rename = "to")]
    pub to: String,

    /// Value of Ether being transferred in Wei
    #[serde(rename = "value")]
    pub value: Option<String>,
}
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
#[cfg_attr(test, derive(Random))]
pub struct Keyfile {
    #[serde(rename = "address")]
    pub address: Option<String>,

    #[serde(rename = "crypto")]
    pub crypto: Option<Crypto>,

    #[serde(rename = "id")]
    pub id: Option<String>,

    #[serde(rename = "version")]
    pub version: Option<f64>,
}
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
#[cfg_attr(test, derive(Random))]
pub struct Crypto {
    #[serde(rename = "cipher")]
    pub cipher: Option<String>,

    #[serde(rename = "cipherparams")]
    pub cipherparams: Option<ObjectEmFzrPeu>,

    #[serde(rename = "ciphertext")]
    pub ciphertext: Option<String>,

    #[serde(rename = "kdf")]
    pub kdf: Option<String>,

    #[serde(rename = "kdfparams")]
    pub kdfparams: Option<ObjectUoYzh4Qk>,

    #[serde(rename = "mac")]
    pub mac: Option<String>,
}
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
#[cfg_attr(test, derive(Random))]
pub struct ObjectEmFzrPeu {
    #[serde(rename = "iv")]
    pub iv: Option<String>,
}
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
#[cfg_attr(test, derive(Random))]
pub struct ObjectUoYzh4Qk {
    #[serde(rename = "dklen")]
    pub dklen: Option<f64>,

    #[serde(rename = "n")]
    pub n: Option<f64>,

    #[serde(rename = "p")]
    pub p: Option<f64>,

    #[serde(rename = "r")]
    pub r: Option<f64>,

    #[serde(rename = "salt")]
    pub salt: Option<String>,
}
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
#[cfg_attr(test, derive(Random))]
pub struct ImportMnemonicOptions {
    #[serde(rename = "description")]
    pub description: Option<String>,

    #[serde(rename = "hd_path")]
    pub hd_path: String,

    /// a list of 24 words
    #[serde(rename = "mnemonic")]
    pub mnemonic: String,

    #[serde(rename = "name")]
    pub name: Option<String>,

    /// passphrase used to encode keyfile (recommend to use 8+ words with good entropy)
    #[serde(rename = "passphrase")]
    pub passphrase: String,
}
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
#[cfg_attr(test, derive(Random))]
pub struct UnknownXWwH5AlxClass {
    #[serde(rename = "address")]
    pub address: String,

    #[serde(rename = "description")]
    pub description: String,

    #[serde(rename = "is_hidden")]
    pub is_hidden: bool,

    #[serde(rename = "name")]
    pub name: String,
}

jsonrpc_client!(pub struct JadeSignerJSONRPCAPI {
  pub fn signer_listAccounts(&mut self, additional: Additional) -> RpcRequest<Accounts>;
pub fn signer_hideAccount(&mut self, address: Address, additional: Additional) -> RpcRequest<HideAccountResult>;
pub fn signer_unhideAccount(&mut self, address: Address, additional: Additional) -> RpcRequest<UnhideAccountResult>;
pub fn signer_newAccount(&mut self, newAccount: NewAccount, additional: Additional) -> RpcRequest<Address>;
pub fn signer_signTypedData(&mut self, address: Address, TypedData: TypedData, passphrase: Passphrase, additional: Additional) -> RpcRequest<SignedTransaction>;
pub fn signer_signTransaction(&mut self, transaction: Transaction, passphrase: Passphrase, additional: Additional) -> RpcRequest<SignedTransaction>;
pub fn signer_importAccount(&mut self, keyfile: Keyfile, additional: Additional) -> RpcRequest<Address>;
pub fn signer_generateMnemonic(&mut self) -> RpcRequest<MnemonicPhrase>;
pub fn signer_importMnemonic(&mut self, importMnemonicOptions: ImportMnemonicOptions, additional: Additional) -> RpcRequest<Address>;
pub fn signer_exportAccount(&mut self, address: Address, additional: Additional) -> RpcRequest<Keyfile>;
pub fn signer_sign(&mut self, dataToSign: DataToSign, address: Address, passphrase: Passphrase, additional: Additional) -> RpcRequest<SignedMessageData>;
});

#[cfg(test)]
mod tests {
    use super::*;
    use test_harness::*;
    use autorand::Random;
    use futures::Future;


  
    #[test]
    #[allow(non_snake_case)]
    fn signer_listAccounts_test () {
        let method = "signer_listAccounts".into();

        let mut params = Vec::new();
  
        let Additional_value = Additional::random();
        let serialized = serde_json::to_value(&Additional_value).unwrap();
        params.push(serialized);
  
        let result = Accounts::random();
        let result_serialized = serde_json::to_vec(&result).unwrap();
        let result: Accounts = serde_json::from_slice(&result_serialized).unwrap();

        let transport = MockTransport {
            method,
            params,
            result: serde_json::to_value(&result).unwrap(),
        };

        let mut client = JadeSignerJSONRPCAPI::new(transport);
        let received_result = client.signer_listAccounts(
          Additional_value
        ).wait().unwrap();

        assert_eq!(result, received_result);
    }

  
    #[test]
    #[allow(non_snake_case)]
    fn signer_hideAccount_test () {
        let method = "signer_hideAccount".into();

        let mut params = Vec::new();
  
        let Address_value = Address::random();
        let serialized = serde_json::to_value(&Address_value).unwrap();
        params.push(serialized);
  
        let Additional_value = Additional::random();
        let serialized = serde_json::to_value(&Additional_value).unwrap();
        params.push(serialized);
  
        let result = HideAccountResult::random();
        let result_serialized = serde_json::to_vec(&result).unwrap();
        let result: HideAccountResult = serde_json::from_slice(&result_serialized).unwrap();

        let transport = MockTransport {
            method,
            params,
            result: serde_json::to_value(&result).unwrap(),
        };

        let mut client = JadeSignerJSONRPCAPI::new(transport);
        let received_result = client.signer_hideAccount(
          Address_value, Additional_value
        ).wait().unwrap();

        assert_eq!(result, received_result);
    }

  
    #[test]
    #[allow(non_snake_case)]
    fn signer_unhideAccount_test () {
        let method = "signer_unhideAccount".into();

        let mut params = Vec::new();
  
        let Address_value = Address::random();
        let serialized = serde_json::to_value(&Address_value).unwrap();
        params.push(serialized);
  
        let Additional_value = Additional::random();
        let serialized = serde_json::to_value(&Additional_value).unwrap();
        params.push(serialized);
  
        let result = UnhideAccountResult::random();
        let result_serialized = serde_json::to_vec(&result).unwrap();
        let result: UnhideAccountResult = serde_json::from_slice(&result_serialized).unwrap();

        let transport = MockTransport {
            method,
            params,
            result: serde_json::to_value(&result).unwrap(),
        };

        let mut client = JadeSignerJSONRPCAPI::new(transport);
        let received_result = client.signer_unhideAccount(
          Address_value, Additional_value
        ).wait().unwrap();

        assert_eq!(result, received_result);
    }

  
    #[test]
    #[allow(non_snake_case)]
    fn signer_newAccount_test () {
        let method = "signer_newAccount".into();

        let mut params = Vec::new();
  
        let NewAccount_value = NewAccount::random();
        let serialized = serde_json::to_value(&NewAccount_value).unwrap();
        params.push(serialized);
  
        let Additional_value = Additional::random();
        let serialized = serde_json::to_value(&Additional_value).unwrap();
        params.push(serialized);
  
        let result = Address::random();
        let result_serialized = serde_json::to_vec(&result).unwrap();
        let result: Address = serde_json::from_slice(&result_serialized).unwrap();

        let transport = MockTransport {
            method,
            params,
            result: serde_json::to_value(&result).unwrap(),
        };

        let mut client = JadeSignerJSONRPCAPI::new(transport);
        let received_result = client.signer_newAccount(
          NewAccount_value, Additional_value
        ).wait().unwrap();

        assert_eq!(result, received_result);
    }

  
    #[test]
    #[allow(non_snake_case)]
    fn signer_signTypedData_test () {
        let method = "signer_signTypedData".into();

        let mut params = Vec::new();
  
        let Address_value = Address::random();
        let serialized = serde_json::to_value(&Address_value).unwrap();
        params.push(serialized);
  
        let TypedData_value = TypedData::random();
        let serialized = serde_json::to_value(&TypedData_value).unwrap();
        params.push(serialized);
  
        let Passphrase_value = Passphrase::random();
        let serialized = serde_json::to_value(&Passphrase_value).unwrap();
        params.push(serialized);
  
        let Additional_value = Additional::random();
        let serialized = serde_json::to_value(&Additional_value).unwrap();
        params.push(serialized);
  
        let result = SignedTransaction::random();
        let result_serialized = serde_json::to_vec(&result).unwrap();
        let result: SignedTransaction = serde_json::from_slice(&result_serialized).unwrap();

        let transport = MockTransport {
            method,
            params,
            result: serde_json::to_value(&result).unwrap(),
        };

        let mut client = JadeSignerJSONRPCAPI::new(transport);
        let received_result = client.signer_signTypedData(
          Address_value, TypedData_value, Passphrase_value, Additional_value
        ).wait().unwrap();

        assert_eq!(result, received_result);
    }

  
    #[test]
    #[allow(non_snake_case)]
    fn signer_signTransaction_test () {
        let method = "signer_signTransaction".into();

        let mut params = Vec::new();
  
        let Transaction_value = Transaction::random();
        let serialized = serde_json::to_value(&Transaction_value).unwrap();
        params.push(serialized);
  
        let Passphrase_value = Passphrase::random();
        let serialized = serde_json::to_value(&Passphrase_value).unwrap();
        params.push(serialized);
  
        let Additional_value = Additional::random();
        let serialized = serde_json::to_value(&Additional_value).unwrap();
        params.push(serialized);
  
        let result = SignedTransaction::random();
        let result_serialized = serde_json::to_vec(&result).unwrap();
        let result: SignedTransaction = serde_json::from_slice(&result_serialized).unwrap();

        let transport = MockTransport {
            method,
            params,
            result: serde_json::to_value(&result).unwrap(),
        };

        let mut client = JadeSignerJSONRPCAPI::new(transport);
        let received_result = client.signer_signTransaction(
          Transaction_value, Passphrase_value, Additional_value
        ).wait().unwrap();

        assert_eq!(result, received_result);
    }

  
    #[test]
    #[allow(non_snake_case)]
    fn signer_importAccount_test () {
        let method = "signer_importAccount".into();

        let mut params = Vec::new();
  
        let Keyfile_value = Keyfile::random();
        let serialized = serde_json::to_value(&Keyfile_value).unwrap();
        params.push(serialized);
  
        let Additional_value = Additional::random();
        let serialized = serde_json::to_value(&Additional_value).unwrap();
        params.push(serialized);
  
        let result = Address::random();
        let result_serialized = serde_json::to_vec(&result).unwrap();
        let result: Address = serde_json::from_slice(&result_serialized).unwrap();

        let transport = MockTransport {
            method,
            params,
            result: serde_json::to_value(&result).unwrap(),
        };

        let mut client = JadeSignerJSONRPCAPI::new(transport);
        let received_result = client.signer_importAccount(
          Keyfile_value, Additional_value
        ).wait().unwrap();

        assert_eq!(result, received_result);
    }

  
    #[test]
    #[allow(non_snake_case)]
    fn signer_generateMnemonic_test () {
        let method = "signer_generateMnemonic".into();

        let mut params = Vec::new();
  
        let result = MnemonicPhrase::random();
        let result_serialized = serde_json::to_vec(&result).unwrap();
        let result: MnemonicPhrase = serde_json::from_slice(&result_serialized).unwrap();

        let transport = MockTransport {
            method,
            params,
            result: serde_json::to_value(&result).unwrap(),
        };

        let mut client = JadeSignerJSONRPCAPI::new(transport);
        let received_result = client.signer_generateMnemonic(
          
        ).wait().unwrap();

        assert_eq!(result, received_result);
    }

  
    #[test]
    #[allow(non_snake_case)]
    fn signer_importMnemonic_test () {
        let method = "signer_importMnemonic".into();

        let mut params = Vec::new();
  
        let ImportMnemonicOptions_value = ImportMnemonicOptions::random();
        let serialized = serde_json::to_value(&ImportMnemonicOptions_value).unwrap();
        params.push(serialized);
  
        let Additional_value = Additional::random();
        let serialized = serde_json::to_value(&Additional_value).unwrap();
        params.push(serialized);
  
        let result = Address::random();
        let result_serialized = serde_json::to_vec(&result).unwrap();
        let result: Address = serde_json::from_slice(&result_serialized).unwrap();

        let transport = MockTransport {
            method,
            params,
            result: serde_json::to_value(&result).unwrap(),
        };

        let mut client = JadeSignerJSONRPCAPI::new(transport);
        let received_result = client.signer_importMnemonic(
          ImportMnemonicOptions_value, Additional_value
        ).wait().unwrap();

        assert_eq!(result, received_result);
    }

  
    #[test]
    #[allow(non_snake_case)]
    fn signer_exportAccount_test () {
        let method = "signer_exportAccount".into();

        let mut params = Vec::new();
  
        let Address_value = Address::random();
        let serialized = serde_json::to_value(&Address_value).unwrap();
        params.push(serialized);
  
        let Additional_value = Additional::random();
        let serialized = serde_json::to_value(&Additional_value).unwrap();
        params.push(serialized);
  
        let result = Keyfile::random();
        let result_serialized = serde_json::to_vec(&result).unwrap();
        let result: Keyfile = serde_json::from_slice(&result_serialized).unwrap();

        let transport = MockTransport {
            method,
            params,
            result: serde_json::to_value(&result).unwrap(),
        };

        let mut client = JadeSignerJSONRPCAPI::new(transport);
        let received_result = client.signer_exportAccount(
          Address_value, Additional_value
        ).wait().unwrap();

        assert_eq!(result, received_result);
    }

  
    #[test]
    #[allow(non_snake_case)]
    fn signer_sign_test () {
        let method = "signer_sign".into();

        let mut params = Vec::new();
  
        let DataToSign_value = DataToSign::random();
        let serialized = serde_json::to_value(&DataToSign_value).unwrap();
        params.push(serialized);
  
        let Address_value = Address::random();
        let serialized = serde_json::to_value(&Address_value).unwrap();
        params.push(serialized);
  
        let Passphrase_value = Passphrase::random();
        let serialized = serde_json::to_value(&Passphrase_value).unwrap();
        params.push(serialized);
  
        let Additional_value = Additional::random();
        let serialized = serde_json::to_value(&Additional_value).unwrap();
        params.push(serialized);
  
        let result = SignedMessageData::random();
        let result_serialized = serde_json::to_vec(&result).unwrap();
        let result: SignedMessageData = serde_json::from_slice(&result_serialized).unwrap();

        let transport = MockTransport {
            method,
            params,
            result: serde_json::to_value(&result).unwrap(),
        };

        let mut client = JadeSignerJSONRPCAPI::new(transport);
        let received_result = client.signer_sign(
          DataToSign_value, Address_value, Passphrase_value, Additional_value
        ).wait().unwrap();

        assert_eq!(result, received_result);
    }

}
