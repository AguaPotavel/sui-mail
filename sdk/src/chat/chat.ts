import { SUI_PACKAGE_ID, CHAT_CONFIG_OBJECT_ID } from "../constants";
import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { getChatTaxes } from "./utils";
import { IChatTax } from "./types";

export class ChatSDK {
  private suiClient: SuiClient;
  private packageId: string;
  private taxes: IChatTax;

  protected constructor(suiClient: SuiClient, taxes: IChatTax) {
    this.suiClient = suiClient;
    this.packageId = SUI_PACKAGE_ID;
    this.taxes = taxes;
  }

  public static async start(suiClient: SuiClient) {
    const taxes = await getChatTaxes(suiClient);
    return new ChatSDK(suiClient, taxes);
  }

  public createChatRoom(): Transaction {
    const tx = new Transaction();
    const [coin] = tx.splitCoins(tx.gas, [this.taxes.createChatTax]);
    tx.moveCall({
      target: `${this.packageId}::chat::create_chat_room`,
      arguments: [tx.object(CHAT_CONFIG_OBJECT_ID), coin],
    });
    return tx;
  }

  public sendChatMessage(
    chatRoomObjectId: string,
    content: string
  ): Transaction {
    const tx = new Transaction();
    const [coin] = tx.splitCoins(tx.gas, [this.taxes.createChatTax]);
    tx.moveCall({
      target: `${this.packageId}::chat::send_chat_message`,
      arguments: [
        tx.object(CHAT_CONFIG_OBJECT_ID),
        tx.object(chatRoomObjectId),
        tx.pure.string(content),
        coin,
      ],
    });
    return tx;
  }

  public async readChatMessages(chatRoomObjectId: string): Promise<any> {
    const chatRoomObject = await this.suiClient.getObject({
      id: chatRoomObjectId,
      options: { showContent: true },
    });
    return chatRoomObject;
  }

  public clearChatMessages(chatRoomObjectId: string): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      target: `${this.packageId}::chat::clear_chat_messages`,
      arguments: [tx.object(chatRoomObjectId)],
    });
    return tx;
  }

  public createChatInvite(
    chatRoomObjectId: string,
    recipientAddress: string,
    paymentCoinId: string
  ): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      target: `${this.packageId}::chat_invite::new`,
      arguments: [
        tx.object(CHAT_CONFIG_OBJECT_ID),
        tx.object(chatRoomObjectId),
        tx.pure.address(recipientAddress),
        tx.object(paymentCoinId),
      ],
    });
    return tx;
  }

  public acceptChatInvite(inviteChatNFTObjectId: string): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      target: `${this.packageId}::chat_invite::accept`,
      arguments: [tx.object(inviteChatNFTObjectId)],
    });
    return tx;
  }

  public denyChatInvite(inviteChatNFTObjectId: string): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      target: `${this.packageId}::chat_invite::deny`,
      arguments: [tx.object(inviteChatNFTObjectId)],
    });
    return tx;
  }
}
