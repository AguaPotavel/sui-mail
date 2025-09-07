import { SuiClient } from "@mysten/sui/client";
import { Transaction, TransactionResult } from "@mysten/sui/transactions";
import {
  SUI_PACKAGE_ID,
  MAILBOX_CONFIG_OBJECT_ID,
  MAILBOX_GLOBAL_OBJECT_ID,
} from "../constants";
import { Email, IMailBoxTax } from "./types";
import { bcs } from "@mysten/sui/bcs";
import { decodeEmails, decodeMailboxId, getMailboxTaxes } from "./utils";

export class MailboxSDK {
  private packageId: string;
  private suiClient: SuiClient;
  private taxes: IMailBoxTax;

  protected constructor(suiClient: SuiClient, taxes: IMailBoxTax) {
    this.suiClient = suiClient;
    this.packageId = SUI_PACKAGE_ID;
    this.taxes = taxes;
  }

  public static async start(suiClient: SuiClient) {
    const taxes = await getMailboxTaxes(suiClient);
    return new MailboxSDK(suiClient, taxes);
  }

  public createInbox(): Transaction {
    const tx = new Transaction();
    const [coin] = tx.splitCoins(tx.gas, [this.taxes.createMailboxTax]);
    tx.moveCall({
      target: `${this.packageId}::mailbox::create_inbox`,
      arguments: [
        tx.object(MAILBOX_GLOBAL_OBJECT_ID),
        tx.object(MAILBOX_CONFIG_OBJECT_ID),
        coin,
      ],
    });
    return tx;
  }

  public sendEmail(
    walletAddress: string,
    mailboxId: string,
    subject: string,
    content: string
  ): Transaction {
    const tx = new Transaction();
    const [coin] = tx.splitCoins(tx.gas, [this.taxes.storeMessageTax]);
    tx.moveCall({
      target: `${this.packageId}::mailbox::send_email`,
      arguments: [
        tx.object(MAILBOX_CONFIG_OBJECT_ID),
        tx.object(mailboxId),
        tx.pure.address(walletAddress),
        tx.pure.string(subject),
        tx.pure.string(content),
        coin,
      ],
    });
    return tx;
  }

  public async readEmails(
    inboxObjectId: string,
    walletAddress: string
  ): Promise<Email[]> {
    const tx = new Transaction();
    tx.moveCall({
      target: `${this.packageId}::mailbox::read_emails`,
      arguments: [tx.object(inboxObjectId)],
    });

    const result = await this.suiClient.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: walletAddress,
    });
    const emails = decodeEmails(result.results?.[0].returnValues?.[0]);
    return emails;
  }

  public clearEmails(inboxObjectId: string): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      target: `${this.packageId}::mailbox::clear_emails`,
      arguments: [tx.object(inboxObjectId)],
    });
    return tx;
  }

  private getMailboxIdTx(
    userAddress: string,
    tx: Transaction
  ): [TransactionResult, Transaction] {
    const mailBoxId = tx.moveCall({
      target: `${this.packageId}::mailbox::get_mailbox_id`,
      arguments: [
        tx.object(MAILBOX_GLOBAL_OBJECT_ID),
        tx.pure.address(userAddress),
      ],
    });
    return [mailBoxId, tx];
  }

  public async getMailBoxId(userAddress: string): Promise<string | undefined> {
    const tx = new Transaction();
    const inboxTx = this.getMailboxIdTx(userAddress, tx);

    const result = await this.suiClient.devInspectTransactionBlock({
      transactionBlock: inboxTx[1],
      sender: userAddress,
    });

    return decodeMailboxId(result.results?.[0].returnValues?.[0]);
  }
}
