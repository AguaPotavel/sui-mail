import { Email } from "bubbleSDK/mailbox/types";

interface EmailItemProps {
  email: Email;
}

export const EmailItem = ({ email }: EmailItemProps) => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-4 mb-3 border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-1">
        {email.subject}
      </h3>
      <p className="text-sm text-gray-600 mb-2">
        From: <span className="font-medium text-gray-700">{email.sender}</span>
      </p>
      <p className="text-sm text-gray-600 mb-2">
        To: <span className="font-medium text-gray-700">{email.recipient}</span>
      </p>
      <p className="text-gray-700 leading-relaxed">{email.content}</p>
      <p className="text-xs text-gray-500 mt-2 text-right">
        {new Date(parseInt(email.timestamp)).toLocaleString()}
      </p>
    </div>
  );
};
