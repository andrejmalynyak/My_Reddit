import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import PostCard from "./components/post";
import { usePostsFromFollows } from "./lib/database";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAuthSession } from "@/lib/auth";
import { Button } from "./components/ui/button";
import { Link } from "react-router-dom";

export default function Feed() {
  const [postCount, setCount] = useState(5);
  const { posts, hasMore } = usePostsFromFollows(postCount);
  const session = useAuthSession();

  return (
    <>
      <InfiniteScroll
        dataLength={posts?.length || 0}
        next={() => setCount(postCount + 5)}
        hasMore={hasMore}
        loader={<h3>Loading...</h3>}
        className="flex flex-col items-center gap-4"
        endMessage="No more posts(("
      >
        {posts
          ? posts.map((post) => <PostCard post={post} />)
          : "No posts for now((("}
      </InfiniteScroll>
      {session && (
        <Link to="/new-post">
          <Button
            variant="round"
            className={`fixed right-8 lg:right-[calc(50%-21rem-8rem)] bottom-20 md:bottom-8 text-lg`}
            size="round"
          >
            <FaPlus />
          </Button>
        </Link>
      )}
    </>
  );
}
