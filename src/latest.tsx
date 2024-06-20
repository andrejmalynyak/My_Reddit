import PostCard from "./components/post";
import { useLatestPosts } from "./lib/database";

export default function LatestPost() {
  const { posts } = useLatestPosts(1);

  return posts && <PostCard post={posts[0]} />;
}
