import { useLatestUserPosts, useUser } from "./lib/database";
import { Link, useParams } from "react-router-dom";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import Checkmark from "./components/ui/checkmark";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState } from "react";
import PostCard from "./components/post";
import { Button } from "./components/ui/button";
import { useAuthSession } from "./lib/auth";

export default function ProfilePage() {
  const { userId } = useParams();
  const user = useUser(userId ?? "");
  const [postCount, setCount] = useState(5);
  const { posts, hasMore } = useLatestUserPosts(postCount, userId ?? "");
  const session = useAuthSession();
  return (
    <article className="mx-auto w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
      <div className="flex flex-col items-center justify-center p-4 md:pt-16 w-full">
        <div className="flex flex-col items-start justify-center w-full md:w-5/6 p-4 md:p-10 m-10 bg-white shadow dark:bg-gray-900 mx-7 rounded-2xl">
          <div className="flex w-full flex-row justify-between">
            <Avatar className="w-28 h-28">
              <AvatarImage alt={user?.name} src={user?.avatar} />
              <AvatarFallback>{user?.name[0]}</AvatarFallback>
            </Avatar>
            {user?.id === session?.user?.id && (
              <Link to="/edituser">
                <Button className="p-4" variant="ghost">
                  Edit Profile
                </Button>
              </Link>
            )}
          </div>
          <div className="flex flex-col gap-0 w-full">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl ">{user?.name}</span>
              <div className="flex flex-row gap-0">
                {user?.checkmarks?.map((type) => (
                  <Checkmark key={type} type={type} />
                ))}
              </div>
            </div>
            <span className="font-black text-xs text-gray-500">
              @{user?.handle}
            </span>
            <span className="font-black text-xs text-gray-500">
              {user?.bio}
            </span>
            <InfiniteScroll
              dataLength={posts?.length || 0}
              next={() => setCount(postCount + 5)}
              hasMore={hasMore}
              loader={<h3>Loading...</h3>}
              className="flex flex-col items-center gap-4 w-full"
              endMessage="No more posts(("
            >
              {posts
                ? posts.map((post) => <PostCard post={post} key={post.id} />)
                : "No posts for now((("}
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </article>
  );
}
