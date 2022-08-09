import axios from "axios";
import {
  Server,
  StellarTomlResolver,
  Keypair,
  Account,
  TransactionBuilder,
  BASE_FEE,
  Networks,
  Operation,
  Asset,
  Transaction,
} from "stellar-sdk";
import { get as loGet, findIndex as loFindIndex } from "lodash";
import { IAccountDetails, IUserDetails } from "../../../types";
import { catchError } from "../../common/utils";

class StellarService {
  homeDomain = process.env.HOME_DOMAIN;
  anchor_user_endpoint = process.env.ANCHOR_USER_ENDPOINT;
  server = new Server("https://horizon-testnet.stellar.org");
  anchor_account_endpoint = process.env.ANCHOR_ACCOUNT_ENDPOINT;

  publicKey: string;
  secretKey: string;
  asset_code: string;
  asset_issuer: string;

  constructor(
    publicKey = "",
    secretKey = "",
    asset_code = "",
    asset_issuer = ""
  ) {
    this.publicKey = publicKey;
    this.secretKey = secretKey;
    this.asset_code = asset_code;
    this.asset_issuer = asset_issuer;
  }

  public async depositAsset(user_detail: IUserDetails, account_detail: IAccountDetails, amount: number) {
    const balances = await this.getBalance();

    const hasCurrency = this.hasCurrency(balances);
    if (hasCurrency === -1) {
      await this.trustAsset();
    }

    // get info from anchor server
    const info = await this.getAnchorInfo();

    // get anchor auth jwt
    const auth = await this.getAnchorAuth();
    const transaction = await this.transaction(auth.transaction, auth.network_passphrase);
    const token = await this.getAnchoJWT(transaction);

    // send user info to anchor server
    const {data} = await axios.post(this.anchor_user_endpoint, user_detail).catch((e) => {
      throw catchError('Error creating user detail', 400) });

    // create user account on anchor
    const account = {
      ...account_detail,
      user: data.id,
    }
    console.log(account, 'account');
    console.log('account detail', account_detail);
    const { data: user_account } = await axios.post(this.anchor_account_endpoint, account).catch((e) => {
      throw catchError('Error creating user account on anchor', 400);
    })

    console.log(user_account);

    // deposit through sep6
    const toml = await this.toml();
    const sep6 = await axios.get(`${toml.TRANSFER_SERVER}/deposit?asset_code=${this.asset_code}&account=${this.publicKey}&user_id=${user_account.id}&amount=${amount}&email=${user_detail.email}&lang=en`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    }).catch((e) => {
      console.log(e);
      throw catchError('Error processing your deposit. Please try again', 400)
    });
    return sep6;
  }

  public async withdraw() {
    const balances = await this.getBalance();

    const hasCurrency = this.hasCurrency(balances);
    if (hasCurrency === -1) {
      await this.trustAsset();
    }

    // get info from anchor server
    const info = await this.getAnchorInfo();

    // get anchor auth jwt
    const auth = await this.getAnchorAuth();
    const transaction = await this.transaction(auth.transaction, auth.network_passphrase);
    const token = await this.getAnchoJWT(transaction);
  }

  public async toml() {
    return await StellarTomlResolver.resolve(this.homeDomain);
  }

  public async updateAccount() {
    const account = await this.server.loadAccount(this.publicKey);
    return account;
  }

  public async fundAccountWithXLM() {
    const xlmPayment = await axios.get(`https://friendbot.stellar.org?addr=${this.publicKey}`);
    return xlmPayment;
  }

  public generateKeypair() {
    const keypair = Keypair.random();
    return { publicKey: keypair.publicKey(), secretKey: keypair.secret() };
  }

  public async trustAsset() {
    const trust = await this.server
      .accounts()
      .accountId(this.publicKey)
      .call()
      .then(({ sequence }) => {
        const account = new Account(this.publicKey, sequence);
        const transaction = new TransactionBuilder(account, {
          fee: BASE_FEE,
          networkPassphrase: Networks.TESTNET,
        })
          .addOperation(
            Operation.changeTrust({
              asset: new Asset(this.asset_code, this.asset_issuer),
            })
          )
          .setTimeout(0)
          .build();

        transaction.sign(Keypair.fromSecret(this.secretKey));
        return this.server.submitTransaction(transaction);
      });

    return trust;
  }

  public async getBalance() {
    const { balances } = await this.server.loadAccount(this.publicKey);
    return balances;
    // const balance = loGet(
    //   { publicKey: this.publicKey, secretKey: this.secretKey },
    //   "state.balance"
    // );
    // console.log(balance, this.publicKey, this.secretKey, 'this is balance - getBalance');
    // return balance;
  }

  public hasCurrency(balances: any[]) {
    const hasCurrency = loFindIndex(balances, {
      //@ts-ignore
      asset_code: this.asset_code,
      asset_issuer: this.asset_issuer,
    });
    return hasCurrency;
  }

  public async getAnchoJWT(transaction: any) {
    const toml = await this.toml();
    const { data } = await axios.post(toml.WEB_AUTH_ENDPOINT, {
     transaction,
    },
    {headers: { "Content-Type": "application/json" }}
    );
    return data.token;
  }

  public async getAnchorAuth() {
    const toml = await this.toml();
    const { data } = await axios.get(toml.WEB_AUTH_ENDPOINT, { params: {
      account: this.publicKey,
    } });
    return data;
  }

  public async getAnchorInfo() {
    const toml = await this.toml();
    const { data } = await axios.get(`${toml.TRANSFER_SERVER}/info`);
    return data;
  }

  public async transaction(transaction: any, network_passphrase: any) {
    console.log(transaction, network_passphrase, 'this is transaction - transaction');
    const transactions = new Transaction(transaction, network_passphrase);
    transactions.sign(Keypair.fromSecret(this.secretKey));
    return transactions.toXDR();
  }
}

export default StellarService;
