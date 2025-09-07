"use client";

import {
  ConnectButton,
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSocialSDK } from "../../providers/SocialSDKProvider";

export default function LoginPage() {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const { socialSDK } = useSocialSDK();
  const router = useRouter();
  const [hasSocialNFT, setHasSocialNFT] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSocialNFT = async () => {
      // Wait for currentAccount to be definitively null (disconnected) or an object (connected)
      if (currentAccount === undefined) { // Still resolving wallet connection
        return;
      }

      if (currentAccount && socialSDK) {
        setLoading(true);
        try {
          const nft = await socialSDK.getOwnedSocialNFT(currentAccount.address);
          setHasSocialNFT(!!nft);
          if (nft) {
            router.push("/feed"); // Redirect to feed if NFT exists
          }
        } catch (error) {
          console.error("Error checking SocialNFT:", error);
          setHasSocialNFT(false);
        } finally {
          setLoading(false);
        }
      } else if (!currentAccount) {
        setLoading(false);
        setHasSocialNFT(null); // Reset if disconnected
      }
    };

    checkSocialNFT();
  }, [currentAccount, socialSDK, router]);

  const handleMintProfile = async () => {
    if (!socialSDK || !currentAccount) return;

    setLoading(true);
    const tx = socialSDK.mint(
      `Bubble User ${Math.random().toString(36).substring(7)}`, // Placeholder name
      "https://via.placeholder.com/150", // Placeholder PFP
      "Hello, I am a new Bubble user!", // Placeholder bio
      [] // No links for now
    );
    signAndExecuteTransaction(
      {
        transaction: tx,
        account: currentAccount,
      },
      {
        onSuccess: async () => {
          const nft = await socialSDK.getOwnedSocialNFT(currentAccount.address);
          setHasSocialNFT(!!nft);
          if (nft) {
            router.push("/");
          }
          setLoading(false);
        },
        onError: async (error) => {
          console.error("Error minting SocialNFT:", error);
          alert("Failed to mint profile. Please try again.");
          setLoading(false);
        },
      }
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!currentAccount) {
    return (
      <div className="flex flex-col md:flex-row items-center justify-between min-h-screen bg-bubble-bg text-bubble-text p-4">
        {/* Left Column: Bubble Info */}
        <div className="md:w-1/2 lg:w-2/4 p-8 text-center md:text-left md:border-r md:border-bubble-accent">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-4 text-bubble-primary drop-shadow-lg">
            Bubble
          </h1>
          <p className="text-2xl md:text-3xl mb-8 font-light">
            Connect, Share, and Thrive in a Decentralized World.
          </p>

          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join the Future of Social
            </h2>
            <ul className="list-disc list-inside text-lg md:text-xl space-y-2 mx-auto md:mx-0 max-w-xs md:max-w-none">
              <li>Connect with friends and new communities</li>
              <li>Share your moments securely on-chain</li>
              <li>Own your data, truly decentralized</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Actions (Connect Wallet) */}
        <div className="md:w-1/2 lg:w-2/4 p-8 text-center max-w-md w-full md:max-w-none">
          <h2 className="text-3xl font-bold mb-6">Connect Your Wallet</h2>
          <p className="text-lg mb-8">
            To unlock your decentralized social experience, please connect your
            Sui wallet.
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  if (currentAccount && hasSocialNFT === false) {
    return (
      <div className="flex flex-col md:flex-row items-center justify-between min-h-screen bg-bubble-bg text-bubble-text p-4">
        {/* Left Column: Bubble Info */}
        <div className="md:w-1/2 lg:w-2/4 p-8 text-center md:text-left md:border-r md:border-bubble-accent">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-4 text-bubble-primary drop-shadow-lg">
            Bubble
          </h1>
          <p className="text-2xl md:text-3xl mb-8 font-light">
            Your gateway to a truly decentralized social experience.
          </p>

          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Establish Your Presence
            </h2>
            <p className="text-lg md:text-xl mb-4">
              Your SocialNFT is your unique identity on Bubble. It's how you
              connect, share, and interact.
            </p>
          </div>
        </div>

        {/* Right Column: Actions (Mint Profile) */}
        <div className="md:w-1/2 lg:w-2/4 p-8 text-center max-w-md w-full md:max-w-none">
          <h2 className="text-3xl font-bold mb-6">
            Create Your Bubble Profile
          </h2>
          <p className="text-lg mb-8">
            It looks like you don&apos;t have a Bubble profile yet. Mint your
            SocialNFT to join the network and start building your decentralized
            presence!
          </p>
          <button
            onClick={handleMintProfile}
            className="px-6 py-3 bg-bubble-primary text-white rounded-lg shadow-md hover:bg-bubble-secondary focus:outline-none focus:ring-2 focus:ring-bubble-primary focus:ring-opacity-50"
          >
            Mint Your Profile
          </button>
        </div>
      </div>
    );
  }

  return null; // Should redirect if hasSocialNFT is true
}
