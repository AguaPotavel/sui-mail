export interface SocialNFT {
  id: string;
  name: string;
  pfp: string;
  bio: string;
  links: string[];
}

export interface Feed {
  id: string;
  publisher: string;
  timestamp: string;
  page_count: number; // Total de páginas
  latest_page: string; // ID da última página
}

export interface Post {
  id: string;
  content: string;
  attachment: string;
  timestamp: string;
}

export interface PostPage {
  id: string;
  next_page?: number;
  posts: Post[];
}
