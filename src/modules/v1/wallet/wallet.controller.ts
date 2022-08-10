import axios from "axios";
import { Request, Response, NextFunction } from "express";
import { catchError, success } from "../../common/utils";
import StellarService from "../stellar/stellar.service";
import WalletService from "./wallet.service";
import { randomBytes } from 'crypto';
import { isAwaitExpression } from "typescript";

export const createAcount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, pinCode } = req.body;
  try {
    // console.log(userId, pinCode, "user Id");
    const wallet = await new WalletService(userId).getWallet();
    // console.log(wallet);
    if (wallet) {
      throw catchError("Wallet already exists", 400);
    }

    const { publicKey, secretKey } = await new StellarService().generateKeypair();
    const account = await new StellarService(
      publicKey,
      secretKey
    )
    await account.fundAccountWithXLM();
    // console.log(account)
    // encrypt secretKey
    const newWallet = await new WalletService("").createWallet({
      userId,
      pinCode,
      usdBalance: "0",
      publicKey,
      secretKey,
      stellarBalance: "1000",
    });
    return res
      .status(200)
      .json(
        success("Wallet created successfully", {
          publicKey,
          secretKey,
          _wallet: newWallet,
          _account: account
        })
      );
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

export const getWallet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;
  try {
    const wallet = await new WalletService(userId).getWallet();
    if (!wallet) {
      throw catchError("Wallet not found", 404);
    }
    return res.status(200).json(success("Wallet fetched successfully", wallet));
  } catch (error) {
    next(error);
  }
};

export const currencyList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const toml = await new StellarService().toml();
    const lists = toml.CURRENCIES;
    return res
      .status(200)
      .json(
        success("Currency list fetched successfully", { currencies: lists })
      );
  } catch (error) {
    next(error);
  }
};

export const deposit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { first_name, last_name, amount, userId, email, pinCode, currency, issuer } = req.body;
  try {
    const wallet = await new WalletService(userId).getWallet();
    if (!wallet) {
      throw catchError("Wallet not found", 400);
    }

    if (wallet.pinCode !== pinCode) {
      throw catchError("Invalid pin code", 400);
    }

    const stellarService = new StellarService(
      wallet.publicKey,
      wallet.secretKey,
      currency,
      issuer
    )
    await stellarService.depositAsset(
      {
        first_name,
        last_name,
        email,
      },
      {
        account: wallet.publicKey,
        memo: randomBytes(16).toString("hex"),
        muxed_account: randomBytes(16).toString("hex"),
      },
      amount
    );
    return res
      .status(200)
      .json(success("Deposit successful", stellarService, { wallet }));
  } catch (error) {
    next(error);
  }
};

export const withdraw = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { first_name, last_name, email, amount, userId, pinCode, currency, issuer } = req.body;
  try {
    // const wallet = await new WalletService(userId).getWallet();
    // if (!wallet) {
    //   throw catchError("Wallet not found", 400);
    // }

    // if (wallet.pinCode !== pinCode) {
    //   throw catchError("Invalid pin code", 400);
    // }

    // const stellarService = await new StellarService(
    //   wallet.publicKey,
    //   wallet.secretKey,
    //   currency,
    //   issuer
    // )

    return res
      .status(200)
      .json({"message": "controller withdraw"})

}   catch (error) {
      next(error);
    }
}
