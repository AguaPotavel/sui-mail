"use client";

import { useState } from "react";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { useMailboxSDK } from "../providers/MailboxSDKProvider";

interface SendEmailFormProps {
  onEmailSent: () => void;
  inboxId: string;
}

export const SendEmailForm = ({ onEmailSent, inboxId }: SendEmailFormProps) => {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentAccount = useCurrentAccount();
  const mailboxSDK = useMailboxSDK();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAccount || !inboxId) {
      setError("Wallet not connected or inbox not found.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const recipientMailboxID = await mailboxSDK.getMailBoxId(recipient);
      if (!recipientMailboxID) {
        alert("User don't have mailbox");
        setLoading(false);
        return;
      }
      const tx = mailboxSDK.sendEmail(
        recipient,
        recipientMailboxID,
        subject,
        content
      );

      signAndExecuteTransaction(
        {
          transaction: tx,
          account: currentAccount,
        },
        {
          onSuccess: () => {
            alert("Email sent successfully!");
            setRecipient("");
            setSubject("");
            setContent("");
            onEmailSent();
          },
          onError: (err) => {
            
            setError("Failed to send email. Please try again.");
          },
        }
      );
    } catch (err) {
      
      setError("Failed to create transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Compose New Email</h2>
      <div className="mb-4">
        <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">Recipient Address:</label>
        <input
          type="text"
          id="recipient"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject:</label>
        <input
          type="text"
          id="subject"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content:</label>
        <textarea
          id="content"
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out resize-y"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md shadow-lg transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send Email'}
      </button>
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </form>
  );
};
