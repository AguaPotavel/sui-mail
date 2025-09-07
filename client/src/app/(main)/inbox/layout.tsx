"use client";

import { MailboxSDKProvider } from "../../../providers/MailboxSDKProvider";

export default function InboxLayout({ children }: { children: React.ReactNode }) {
  return (
    <MailboxSDKProvider>
      {children}
    </MailboxSDKProvider>
  );
}
