"use client";

import { createContext, useContext, useMemo, ReactNode } from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import { SocialSDK } from "bubbleSDK/social/social";

interface SocialSDKContextType {
  socialSDK: SocialSDK | null;
}

const SocialSDKContext = createContext<SocialSDKContextType | undefined>(
  undefined
);

export function SocialSDKProvider({ children }: { children: ReactNode }) {
  const suiClient = useSuiClient();

  const socialSDK = useMemo(() => {
    if (!suiClient) return null;
    return SocialSDK.start(suiClient);
  }, [suiClient]);

  return (
    <SocialSDKContext.Provider value={{ socialSDK }}>
      {children}
    </SocialSDKContext.Provider>
  );
}

export function useSocialSDK() {
  const context = useContext(SocialSDKContext);
  if (context === undefined) {
    throw new Error("useSocialSDK must be used within a SocialSDKProvider");
  }
  return context;
}
