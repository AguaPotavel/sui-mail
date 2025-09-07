import { SuiClient } from "@mysten/sui/client";
import { bcsEmails, Email, IMailBoxTax } from "./types";
import { Transaction } from "@mysten/sui/transactions";
import { MAILBOX_CONFIG_OBJECT_ID, SUI_PACKAGE_ID } from "../constants";
import { bcs } from "@mysten/sui/bcs";
import { normalizeSuiAddress, toHex } from "@mysten/sui/utils";

export const getMailboxTaxes = async (
  suiClient: SuiClient
): Promise<IMailBoxTax> => {
  const tx = new Transaction();

  tx.moveCall({
    target: `${SUI_PACKAGE_ID}::mailbox_config::get_create_mailbox_tax`,
    arguments: [tx.object(MAILBOX_CONFIG_OBJECT_ID)],
  });
  tx.moveCall({
    target: `${SUI_PACKAGE_ID}::mailbox_config::get_store_message_tax`,
    arguments: [tx.object(MAILBOX_CONFIG_OBJECT_ID)],
  });
  const taxResults = await suiClient.devInspectTransactionBlock({
    transactionBlock: tx,
    sender: normalizeSuiAddress("0x0"),
  });

  const createMailboxTax = bcs
    .u64()
    .parse(
      new Uint8Array(taxResults.results?.[0]?.returnValues?.[0]?.[0] || [0])
    );
  const storeMessageTax = bcs
    .u64()
    .parse(
      new Uint8Array(taxResults.results?.[1]?.returnValues?.[0]?.[0] || [0])
    );

  return {
    createMailboxTax: Number(createMailboxTax),
    storeMessageTax: Number(storeMessageTax),
  };
};

export const decodeMailboxId = (
  returnValue: [number[], string] | undefined
): string | undefined => {
  if (!returnValue || returnValue[1] !== "0x2::object::ID") {
    return undefined;
  }
  return `0x${toHex(Uint8Array.from(returnValue[0]))}`;
};

export const decodeEmails = (
  returnValue: [number[], string] | undefined
): Email[] => {
  if (!returnValue) {
    return [];
  }
  const raw = Uint8Array.from(returnValue[0]);
  return bcsEmails.parse(raw);
};
