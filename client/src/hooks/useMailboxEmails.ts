import { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Email } from "bubbleSDK/mailbox/types";
import { useMailboxSDK } from "../providers/MailboxSDKProvider";

export const useMailboxEmails = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inboxId, setInboxId] = useState<string | undefined>(undefined);
  const currentAccount = useCurrentAccount();
  const mailboxSDK = useMailboxSDK();

  const checkInbox = async () => {
    if (!currentAccount) return;
    const id = await mailboxSDK.getMailBoxId(currentAccount.address);
    setInboxId(id);
  };

  const fetchEmails = async () => {
    if (!currentAccount || !inboxId) {
      setError("No wallet connected or no inbox found.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const fetchedEmails = await mailboxSDK.readEmails(
        inboxId,
        currentAccount.address
      );

      setEmails(fetchedEmails);
    } catch (err) {
      setError("Failed to fetch emails. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { emails, loading, error, fetchEmails, inboxId, checkInbox };
};
