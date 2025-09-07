import { SuiClient } from "@mysten/sui/client";
import { IChatTax } from "./types";
import { Transaction } from "@mysten/sui/transactions";
import { CHAT_CONFIG_OBJECT_ID, SUI_PACKAGE_ID } from "../constants";
import { bcs } from "@mysten/sui/bcs";

export const getChatTaxes = async (suiClient: SuiClient): Promise<IChatTax> => {
  const tx = new Transaction();

  tx.moveCall({
    target: `${SUI_PACKAGE_ID}::mailbox_config::get_create_chat_tax`,
    arguments: [tx.object(CHAT_CONFIG_OBJECT_ID)],
  });
  tx.moveCall({
    target: `${SUI_PACKAGE_ID}::mailbox_config::get_send_message_tax`,
    arguments: [tx.object(CHAT_CONFIG_OBJECT_ID)],
  });
  tx.moveCall({
    target: `${SUI_PACKAGE_ID}::mailbox_config::get_invite_tax`,
    arguments: [tx.object(CHAT_CONFIG_OBJECT_ID)],
  });
  const taxResults = await suiClient.devInspectTransactionBlock({
    transactionBlock: tx,
    sender: "0x0",
  });

  const createChatTax = bcs
    .u64()
    .parse(
      new Uint8Array(taxResults.results?.[0]?.returnValues?.[0]?.[0] || [0])
    );
  const sendMessageTax = bcs
    .u64()
    .parse(
      new Uint8Array(taxResults.results?.[1]?.returnValues?.[0]?.[0] || [0])
    );
  const inviteTax = bcs
    .u64()
    .parse(
      new Uint8Array(taxResults.results?.[1]?.returnValues?.[0]?.[0] || [0])
    );

  return {
    createChatTax: Number(createChatTax),
    sendMessageTax: Number(sendMessageTax),
    inviteTax: Number(inviteTax),
  };
};
