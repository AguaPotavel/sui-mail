import { SuiObjectData } from "@mysten/sui/client";
import { PostPage, Post } from "./types";
import { bcs } from "@mysten/sui/bcs";

interface SuiPostPage {
  id: { id: string };
  next_page?: string;
  posts: [
    {
      fields: {
        id: { id: string };
        attachment: number[];
        content: string;
        timestamp: string;
      };
    },
  ];
}

export function parsePostPage(
  obj: SuiObjectData | null | undefined
): PostPage | undefined {
  if (!obj || obj.content?.dataType !== "moveObject") {
    return undefined;
  }
  const { id, next_page, posts } = obj.content.fields as unknown as SuiPostPage;

  const parsedPosts = posts.map<Post>((p) => {
    const stringVector = new Uint8Array(p.fields.attachment);
    return {
      id: p.fields.id.id,
      attachment: new TextDecoder().decode(stringVector),
      content: p.fields.content,
      timestamp: p.fields.timestamp,
    };
  });

  return {
    id: id.id,
    next_page: next_page ? Number(next_page) : undefined,
    posts: parsedPosts,
  };
}
