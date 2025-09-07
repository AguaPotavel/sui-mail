"use client";

import { ConnectButton, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect } from "react";
import { useMailboxEmails } from "../../../hooks/useMailboxEmails";
import { EmailList } from "../../../components/EmailList";
import { FetchEmailsButton } from "../../../components/FetchEmailsButton";
import { SendEmailForm } from "../../../components/SendEmailForm";
import { useMailboxSDK } from "../../../providers/MailboxSDKProvider";

export default function InboxPage() {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecuteTransaction, isPending: isMinting } =
    useSignAndExecuteTransaction();
  const { emails, loading, error, fetchEmails, inboxId, checkInbox } =
    useMailboxEmails();
  const mailboxSDK = useMailboxSDK();

  useEffect(() => {
    if (currentAccount && inboxId) {
      fetchEmails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount, inboxId]);

  useEffect(() => {
    checkInbox();
  }, []);

  const handleMintInbox = () => {
    if (!currentAccount) return;

    signAndExecuteTransaction(
      {
        transaction: mailboxSDK.createInbox(),
        account: currentAccount,
      },
      {
        onSuccess: () => {
          alert("Inbox minted successfully!");
          checkInbox();
        },
        onError: (err) => {
          alert("Failed to mint inbox. Please try again.");
          console.error(err);
        },
      }
    );
  };

  const handleEmailSent = () => {
    fetchEmails();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bubble-bg text-bubble-text">
        Loading inbox status...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-bubble-bg flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-3xl bg-bubble-bg shadow-lg rounded-lg p-6">
        <header className="flex justify-between items-center mb-6 pb-4 border-b border-bubble-accent">
          <h1 className="text-3xl font-extrabold text-bubble-text">
            Bubble Mailbox
          </h1>
        </header>

        {inboxId ? (
          <section>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-bubble-text">
                Your Inbox
              </h2>
              <FetchEmailsButton onClick={fetchEmails} loading={loading} />
            </div>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <EmailList emails={emails} />
            <div className="mt-8 pt-6 border-t border-bubble-accent">
              <SendEmailForm onEmailSent={handleEmailSent} inboxId={inboxId} />
            </div>
          </section>
        ) : (
          <div className="text-center py-10">
            <p className="text-lg text-bubble-text mb-6">
              It looks like you don&apos;t have a mailbox yet. Mint one to start
              sending and receiving emails!
            </p>
            <button
              onClick={handleMintInbox}
              disabled={isMinting}
              className="bg-bubble-accent text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-bubble-hover-bg focus:outline-none focus:ring-2 focus:ring-bubble-primary focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isMinting ? "Minting..." : "Mint Your Mailbox"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
