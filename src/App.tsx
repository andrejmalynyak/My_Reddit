import Post from "@/components/post";
import { ThemeProvider } from "@/components/theme-provider";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useParams,
} from "react-router-dom";
import Chats from "./components/chats";
import { ReplyingProvider } from "./components/single-reply-box-provider";
import { ChatsProvider } from "./lib/chat";
import { DataProvider, usePostPreview } from "./lib/database";
import Navigation from "./components/navigation";
import Homepage from "./homepage";
import NewPost from "./components/new_post";
import Feed from "./feed";
import CreateProfile from "./create-profile";
import ProfilePage from "./userpage";
import LatestPost from "./latest";
import EditProfilePage from "./editprofile";
import UserSearch from "./usersearch";
import { CommentSelectorProvider } from "./lib/comment-selector";

function PostPage() {
  const { id } = useParams();
  const post = usePostPreview(id || "");

  return post && <Post post={post} />;
}

function CommentPage() {
  const { id, commentId } = useParams();
  const post = usePostPreview(id || "");

  return (
    post &&
    commentId && (
      <CommentSelectorProvider commentId={commentId}>
        <Post post={post} />
      </CommentSelectorProvider>
    )
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <div className="pb-16 md:pb-0 md:pt-16">
          <Outlet />
        </div>
        <Navigation />
      </>
    ),
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: "feed",
        element: <Feed />,
      },
      {
        path: "latest",
        element: <LatestPost />,
      },
      {
        path: "search",
        element: <UserSearch />,
      },
      {
        path: "posts/:id",
        children: [
          {
            index: true,
            element: <PostPage />,
          },
          {
            path: "comments/:commentId",
            element: <CommentPage />,
          },
        ],
      },
      {
        path: "chats",
        element: (
          <div className="h-screen">
            <Chats />
          </div>
        ),
        children: [
          {
            path: ":chatId",
            element: (
              <div className="h-screen">
                <Chats />
              </div>
            ),
          },
        ],
      },
      {
        path: "new-post",
        element: <NewPost />,
      },
      {
        path: "/create-profile",
        element: <CreateProfile />,
      },
      {
        path: "/users/:userId",
        element: <ProfilePage />,
      },
      {
        path: "/edituser",
        element: <EditProfilePage />,
      },
    ],
  },
]);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <DataProvider>
        <ReplyingProvider>
          <ChatsProvider>
            <RouterProvider router={router} />
          </ChatsProvider>
        </ReplyingProvider>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
