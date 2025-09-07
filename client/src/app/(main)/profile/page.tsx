"use client";

import { useEffect, useState } from "react";
import { useMainLayoutContext } from "@/app/(main)/layout"; // Adjust path as needed
import { useSocialActions } from "@/hooks/useSocialActions";

export default function ProfilePage() {
  const { userSocialNFT, currentAccount, refreshSocialNFT } =
    useMainLayoutContext();
  const { updateProfile, loading, error } = useSocialActions();
  const [name, setName] = useState("");
  const [pfp, setPfp] = useState("");
  const [bio, setBio] = useState("");
  const [links, setLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState("");

  useEffect(() => {
    if (userSocialNFT) {
      setName(userSocialNFT.name);
      setPfp(userSocialNFT.pfp);
      setBio(userSocialNFT.bio);
      setLinks(userSocialNFT.links || []);
    }
  }, [userSocialNFT]);

  const handleAddLink = () => {
    if (newLink.trim() !== "") {
      setLinks([...links, newLink.trim()]);
      setNewLink("");
    }
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userSocialNFT || !currentAccount) return;

    const success = await updateProfile({
      socialObjectId: userSocialNFT.id,
      name,
      pfp,
      bio,
      oldLinks: userSocialNFT.links, // Pass old links for comparison
      newLinks: links, // Pass new links
    });

    if (success) {
      alert("Profile updated successfully!");
      refreshSocialNFT(); // Refresh the social NFT data in the layout
    } else {
      alert(`Failed to update profile: ${error?.message || "Unknown error"}`);
    }
  };

  return (
    <div className="md:w-3/4 lg:w-4/5 p-4">
      <div className="max-w-2xl mx-auto bg-bubble-secondary p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Edit Your Profile
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-lg font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-md bg-bubble-bg border border-bubble-accent focus:outline-none focus:ring-2 focus:ring-bubble-primary"
              required
            />
          </div>
          <div>
            <label htmlFor="pfp" className="block text-lg font-medium mb-2">
              Profile Picture URL
            </label>
            <input
              type="url"
              id="pfp"
              value={pfp}
              onChange={(e) => setPfp(e.target.value)}
              className="w-full p-3 rounded-md bg-bubble-bg border border-bubble-accent focus:outline-none focus:ring-2 focus:ring-bubble-primary"
              required
            />
          </div>
          <div>
            <label htmlFor="bio" className="block text-lg font-medium mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full p-3 rounded-md bg-bubble-bg border border-bubble-accent focus:outline-none focus:ring-2 focus:ring-bubble-primary"
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="links" className="block text-lg font-medium mb-2">
              Links
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="url"
                id="newLink"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                className="flex-grow p-3 rounded-md bg-bubble-bg border border-bubble-accent focus:outline-none focus:ring-2 focus:ring-bubble-primary"
                placeholder="Add new link URL"
              />
              <button
                type="button"
                onClick={handleAddLink}
                className="px-4 py-2 bg-bubble-primary text-white rounded-md hover:bg-bubble-secondary focus:outline-none focus:ring-2 focus:ring-bubble-primary focus:ring-opacity-50"
              >
                Add
              </button>
            </div>
            <ul className="space-y-1">
              {links.map((link, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-bubble-bg p-2 rounded-md"
                >
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-bubble-primary hover:underline truncate"
                  >
                    {link}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-bubble-primary text-white rounded-md font-semibold hover:bg-bubble-secondary focus:outline-none focus:ring-2 focus:ring-bubble-primary focus:ring-opacity-50"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
