"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Added useRouter
import { useDisconnectWallet } from "@mysten/dapp-kit"; // Added useWallet

interface VerticalNavbarProps {
  userSocialNFT?: {
    pfp: string;
    name: string;
    bio: string;
    links: string[];
  } | null;
  walletAddress?: string; // New prop
}

export default function VerticalNavbar({
  userSocialNFT,
  walletAddress,
}: VerticalNavbarProps) {
  const pathname = usePathname();
  const router = useRouter(); // Initialize useRouter
  const { mutate: disconnect } = useDisconnectWallet();

  const handleDisconnect = async () => {
    disconnect();
    router.push("/login"); // Redirect to login page after disconnecting
  };

  return (
    <div className="md:w-1/4 lg:w-1/5 p-4 border-r-[1px] border-bubble-accent flex flex-col sticky top-0 h-screen overflow-y-auto">
      {/* User Info Section */}
      <div className="my-8 pb-4">
        {userSocialNFT && (
          <div className="flex items-center mb-4">
            {" "}
            {/* Flex container for image and text */}
            <img
              src={userSocialNFT.pfp}
              alt="Profile Picture"
              className="w-16 h-16 rounded-full mr-4" // Smaller image, margin-right
            />
            <div>
              {" "}
              {/* Container for name and address */}
              <p className="text-xl font-semibold">{userSocialNFT.name}</p>
              {walletAddress && (
                <p className="text-sm text-bubble-accent truncate">
                  {walletAddress.substring(0, 6)}...
                  {walletAddress.substring(walletAddress.length - 4)}
                </p>
              )}
            </div>
          </div>
        )}
        {userSocialNFT && (
          <div className="space-y-2">
            <p className="text-sm text-bubble-accent">{userSocialNFT.bio}</p>
            {userSocialNFT.links && userSocialNFT.links.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Links:</h3>
                <ul className="list-disc list-inside">
                  {userSocialNFT.links.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-bubble-primary hover:underline"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Section */}
      <nav className="flex-grow">
        <ul className="space-y-2">
          <li>
            <Link
              href="/feed"
              className={`flex items-center p-2 text-lg font-medium rounded-lg ${
                pathname === "/feed"
                  ? "bg-bubble-secondary"
                  : "hover:bg-bubble-secondary"
              }`}
            >
              {/* Icon Placeholder */}
              <span className="mr-3">🏠</span>
              Feed
            </Link>
          </li>
          <li>
            <Link
              href="/profile"
              className={`flex items-center p-2 text-lg font-medium rounded-lg ${
                pathname === "/profile"
                  ? "bg-bubble-secondary"
                  : "hover:bg-bubble-secondary"
              }`}
            >
              {/* Icon Placeholder */}
              <span className="mr-3">👤</span>
              Profile
            </Link>
          </li>
          <li>
            <Link
              href="/inbox"
              className={`flex items-center p-2 text-lg font-medium rounded-lg ${
                pathname === "/inbox"
                  ? "bg-bubble-secondary"
                  : "hover:bg-bubble-secondary"
              }`}
            >
              {/* Icon Placeholder */}
              <span className="mr-3">✉️</span>
              Inbox
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              className={`flex items-center p-2 text-lg font-medium rounded-lg ${
                pathname === "/settings"
                  ? "bg-bubble-secondary"
                  : "hover:bg-bubble-secondary"
              }`}
            >
              {/* Icon Placeholder */}
              <span className="mr-3">⚙️</span>
              Settings
            </Link>
          </li>
          {/* Disconnect Option */}
          <li>
            <button
              onClick={handleDisconnect}
              className="flex items-center p-2 text-lg font-medium rounded-lg w-full text-left hover:bg-bubble-secondary"
            >
              {/* Icon Placeholder */}
              <span className="mr-3">🔌</span>
              Disconnect
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
