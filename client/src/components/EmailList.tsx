import { Email } from "bubbleSDK/mailbox/types";
import { EmailItem } from "./EmailItem";

interface EmailListProps {
  emails: Email[];
}

export const EmailList = ({ emails }: EmailListProps) => {
  if (emails.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">No emails to display.</p>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {emails.map((email, index) => (
        <EmailItem key={index} email={email} />
      ))}
    </div>
  );
};
