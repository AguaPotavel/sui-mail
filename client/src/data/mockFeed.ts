export interface FeedPost {
  id: string;
  author: string;
  authorPfp: string;
  content: string;
  timestamp: string;
  comments: number; // New field
  shares: number;   // New field
}

export const mockFeedData: FeedPost[] = [
  {
    id: 'post1',
    author: 'Alice',
    authorPfp: 'https://placehold.co/40/FF5733/FFFFFF?text=A',
    content: 'Just joined Bubble! Excited to connect with everyone here. This decentralized social network is truly revolutionary. I\'m looking forward to sharing my thoughts and experiences with all of you. Let\'s build something amazing together! #decentralized #social #web3 #community',
    timestamp: '2 hours ago',
    comments: 5,
    shares: 2,
  },
  {
    id: 'post2',
    author: 'Bob',
    authorPfp: 'https://placehold.co/40/33FF57/FFFFFF?text=B',
    content: 'Exploring the new features on Bubble. Loving the privacy controls! What are your favorite features? I\'m particularly impressed with how easy it is to manage my data and connect with like-minded individuals. This platform truly puts users first. #privacy #features #decentralized',
    timestamp: '5 hours ago',
    comments: 12,
    shares: 7,
  },
  {
    id: 'post3',
    author: 'Charlie',
    authorPfp: 'https://placehold.co/40/3357FF/FFFFFF?text=C',
    content: 'Decentralization is the future. Proud to be part of the Bubble community. The ability to truly own my content and interact without intermediaries is a game-changer. This is what social media should have always been. Join us and experience true freedom! #web3 #community #decentralization',
    timestamp: '1 day ago',
    comments: 8,
    shares: 3,
  },
  {
    id: 'post4',
    author: 'Diana',
    authorPfp: 'https://placehold.co/40/FF33F7/FFFFFF?text=D',
    content: 'Sharing my latest thoughts on the importance of data ownership. Check out my bio for more! In a world where personal data is constantly exploited, platforms like Bubble offer a beacon of hope. Take control of your digital life. #dataownership #privacy #decentralized #freedom',
    timestamp: '2 days ago',
    comments: 15,
    shares: 10,
  },
  {
    id: 'post5',
    author: 'Eve',
    authorPfp: 'https://placehold.co/40/F7FF33/FFFFFF?text=E',
    content: 'Had a great chat with some fellow Bubblers today. This community is amazing! The discussions are always insightful, and everyone is so supportive. It\'s refreshing to be part of a space where genuine connections are fostered. Highly recommend joining if you value authentic interactions!',
    timestamp: '3 days ago',
    comments: 20,
    shares: 18,
  }
];
