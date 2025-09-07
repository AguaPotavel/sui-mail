"use client";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { useSocialSDK } from "../../providers/SocialSDKProvider";
import { SocialNFT } from "bubbleSDK/social/types";
import VerticalNavbar from "../../components/VerticalNavbar";

// Create a context to share the social NFT and account info
interface MainLayoutContextType {
  userSocialNFT: SocialNFT | null;
  currentAccount: ReturnType<typeof useCurrentAccount>;
  refreshSocialNFT: () => void;
}

const MainLayoutContext = createContext<MainLayoutContextType | null>(null);

export function useMainLayoutContext() {
  const context = useContext(MainLayoutContext);
  if (!context) {
    throw new Error("useMainLayoutContext must be used within a MainLayout");
  }
  return context;
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentAccount = useCurrentAccount();
  const { socialSDK } = useSocialSDK();
  const router = useRouter();
  const [userSocialNFT, setUserSocialNFT] = useState<SocialNFT | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserNFT = async () => {
    if (!currentAccount || !socialSDK) return;
    setLoading(true);
    try {
      const nft = await socialSDK.getOwnedSocialNFT(currentAccount.address);
      if (!nft) {
        router.push("/login");
      } else {
        setUserSocialNFT(nft);
      }
    } catch (error) {
      console.error("Error checking SocialNFT:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentAccount === undefined) {
      return; // Wait for wallet connection to be resolved
    }
    if (!currentAccount) {
      router.push("/login");
      return;
    }
    if (socialSDK) {
      fetchUserNFT();
    }
  }, [currentAccount, socialSDK, router]);

  if (loading || !userSocialNFT) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bubble-bg text-bubble-text">
        Loading...
      </div>
    );
  }

  return (
    <MainLayoutContext.Provider
      value={{ userSocialNFT, currentAccount, refreshSocialNFT: fetchUserNFT }}
    >
      <div className="flex flex-col md:flex-row min-h-screen bg-bubble-bg text-bubble-text">
        <VerticalNavbar
          userSocialNFT={userSocialNFT}
          walletAddress={currentAccount?.address}
        />
        {children}
      </div>
    </MainLayoutContext.Provider>
  );
}
