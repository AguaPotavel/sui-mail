import { createContext, useContext, useEffect, useState } from "react";
import { MailboxSDK } from "bubbleSDK/mailbox/mailbox";
import { suiClient } from "@/sui/sui";

const MailboxSDKContext = createContext<MailboxSDK | null>(null);

export const useMailboxSDK = () => {
  const context = useContext(MailboxSDKContext);
  if (!context) {
    throw new Error("useMailboxSDK must be used within a MailboxSDKProvider");
  }
  return context;
};

export function MailboxSDKProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mailboxSDK, setMailboxSDK] = useState<MailboxSDK | null>(null);
  const [loadingSDK, setLoadingSDK] = useState(true);

  useEffect(() => {
    const initMailboxSDK = async () => {
      try {
        const sdk = await MailboxSDK.start(suiClient);
        setMailboxSDK(sdk);
      } catch (error) {
      } finally {
        setLoadingSDK(false);
      }
    };

    initMailboxSDK();
  }, []);

  if (loadingSDK) {
    return <div>Loading Mailbox SDK...</div>; // Or a more sophisticated loading indicator
  }

  if (!mailboxSDK) {
    return <div>Error: Mailbox SDK failed to load.</div>; // Handle error case
  }

  return (
    <MailboxSDKContext.Provider value={mailboxSDK}>
      {children}
    </MailboxSDKContext.Provider>
  );
}
