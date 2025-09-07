"use client";

import { mockFeedData, FeedPost } from "@/data/mockFeed";
import { useMainLayoutContext } from "../layout";
export default function FeedPage() {
  const { userSocialNFT, currentAccount, refreshSocialNFT } =
    useMainLayoutContext();

  return (
    <div className="flex flex-row md:w-1/2 lg:w-4/5">
      {/* Left Column: Vertical Navbar */}

      {/* Middle Column: Feed Content - Made scrollable */}
      <div className="md:w-1/2 lg:w-4/6">
        {/* Create Post Section */}
        <div className="p-4">
          <div className="bg-bubble-secondary p-6 rounded-lg shadow-md mb-6">
            <textarea
              className="w-full p-3 rounded-md bg-bubble-bg border border-bubble-accent focus:outline-none focus:ring-2 focus:ring-bubble-primary resize-y min-h-[80px]"
              placeholder="What's on your mind?"
            ></textarea>
            <button className="mt-4 px-6 py-2 bg-bubble-primary text-white rounded-md font-semibold hover:bg-bubble-secondary focus:outline-none focus:ring-2 focus:ring-bubble-primary focus:ring-opacity-50">
              Post
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-bold p-4 border-b">Feed</h2>
        <div>
          {/* Removed space-y-4 */}
          {mockFeedData.map((post: FeedPost) => (
            <div
              key={post.id}
              className="p-6 border-b border-bubble-accent transition-all duration-200 ease-in-out hover:bg-bubble-hover-bg cursor-pointer"
            >
              <div className="flex items-center mb-4">
                <img
                  src={post.authorPfp}
                  alt={post.author}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-semibold text-lg">{post.author}</p>
                  <p className="text-sm text-bubble-accent">{post.timestamp}</p>
                </div>
              </div>
              <p className="text-base">{post.content}</p>
              <div className="flex items-center mt-4 text-sm text-bubble-accent">
                <span className="mr-4">💬 {post.comments} Comments</span>
                <span>🔁 {post.shares} Shares</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Right Column: Right Sticky Navbar */}
      <div className="md:w-1/2 lg:w-2/6 p-4 border-l-[1px] border-bubble-accent flex flex-col sticky top-0 h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Trending</h2>
        <div className="space-y-4 mb-8">
          <div className="bg-bubble-secondary p-4 rounded-lg shadow-md">
            <p className="font-semibold">#DecentralizedWeb</p>
            <p className="text-sm text-bubble-accent">1.2K posts</p>
          </div>
          <div className="bg-bubble-secondary p-4 rounded-lg shadow-md">
            <p className="font-semibold">#SuiBlockchain</p>
            <p className="text-sm text-bubble-accent">800 posts</p>
          </div>
          <div className="bg-bubble-secondary p-4 rounded-lg shadow-md">
            <p className="font-semibold">#BubbleCommunity</p>
            <p className="text-sm text-bubble-accent">500 posts</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Who to Follow</h2>
        <div className="space-y-4">
          <div className="bg-bubble-secondary p-4 rounded-lg shadow-md flex items-center">
            <img
              src="https://placehold.co/40/FF5733/FFFFFF?text=X"
              alt="User X"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="font-semibold">User X</p>
              <p className="text-sm text-bubble-accent">@user_x</p>
            </div>
            <button className="ml-auto px-3 py-1 bg-bubble-primary text-white rounded-md text-sm hover:bg-bubble-secondary">
              Follow
            </button>
          </div>
          <div className="bg-bubble-secondary p-4 rounded-lg shadow-md flex items-center">
            <img
              src="https://placehold.co/40/33FF57/FFFFFF?text=Y"
              alt="User Y"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="font-semibold">User Y</p>
              <p className="text-sm text-bubble-accent">@user_y</p>
            </div>
            <button className="ml-auto px-3 py-1 bg-bubble-primary text-white rounded-md text-sm hover:bg-bubble-secondary">
              Follow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
