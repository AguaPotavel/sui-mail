import { bcs } from "@mysten/sui/bcs";

export interface IMailBoxTax {
  createMailboxTax: number;
  storeMessageTax: number;
}

export interface Email {
  sender: string;
  recipient: string;
  subject: string;
  content: string;
  timestamp: string;
}
const bcsEmail = bcs.struct("Email", {
  sender: bcs.Address,
  recipient: bcs.Address,
  subject: bcs.string(),
  content: bcs.string(),
  timestamp: bcs.u64(),
});

export const bcsEmails = bcs.vector(bcsEmail);
