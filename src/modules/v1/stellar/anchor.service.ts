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
import StellarService from "./stellar.service";

class StellarAnchorService {
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
    const balances = await new StellarService().getBalance();

    const hasCurrency = new StellarService().hasCurrency(balances);
    console.log(hasCurrency);
    if (hasCurrency === -1) {
      await this.trustAsset();
    }

    // get info from anchor server
    const info = await this.getAnchorInfo();
    console.log('info', info);

    // get anchor auth jwt
    const auth = await this.getAnchorAuth();
    console.log(auth, 'auth');
    const transaction = await new StellarService().transaction(auth.transaction, auth.network_passphrase);
    const token = await this.getAnchoJWT(transaction);

    // send user info to anchor server
    const {data} = await axios.post(this.anchor_user_endpoint, user_detail).catch((e) => {
      console.log(user_detail)
      throw catchError('Error creating user detail', 400) });
    console.log(data);

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

  public async withdrawAsset(){
    console.log('end of withdrawasset function')
  }

  public async toml() {
    return await StellarTomlResolver.resolve(this.homeDomain);
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

}

export default StellarAnchorService;
