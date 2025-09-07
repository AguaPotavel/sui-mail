"use client";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSocialSDK } from "../providers/SocialSDKProvider";

export default function Home() {
  const currentAccount = useCurrentAccount();
  const { socialSDK } = useSocialSDK();
  const router = useRouter();

  useEffect(() => {
    const checkUserStatus = async () => {
      if (currentAccount === undefined) {
        return;
      }

      if (!currentAccount) {
        router.push("/login");
        return;
      }

      if (socialSDK) {
        try {
          const nft = await socialSDK.getOwnedSocialNFT(currentAccount.address);
          if (nft) {
            router.push("/feed");
          } else {
            router.push("/login");
          }
        } catch (error) {
          console.error("Error checking SocialNFT:", error);
          router.push("/login");
        }
      }
    };

    checkUserStatus();
  }, [currentAccount, socialSDK, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      Loading...
    </div>
  );
}
