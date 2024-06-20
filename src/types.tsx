export type CheckmarkType = "twitter" | "discord" | "moderator";
export type ReactionType = "like";

export interface AddCommentArgs {
  postId: string;
  parentId: string | null;
  content: string;
}

export type User = {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  bio?: string;
  checkmarks?: CheckmarkType[];

  amFollowing?: boolean;
};

export type Comment = {
  parentPost: string;
  parentComment?: string;
  id: string;
  permalink: string;

  content: string;

  authorId: string;
  postedAt: Date;

  replies?: Comment[];
  reactions?: { [key in ReactionType]: number };
  reactedByLoggedInUser?: ReactionType[];
};

export type Post = {
  id: string;
  permalink: string;

  title: string;
  badges?: string[];
  content: string;
  images?: string[];

  authorId: string;
  postedAt: Date;

  replies: Comment[];
  replyCount?: number;
  reactions?: { [key in ReactionType]: number };
  reactedByLoggedInUser?: ReactionType[];
};

export type NewPostForm = {
  title: string;
  content: string;
  badges?: string[];
  images?: string[];

  author: string;
};
