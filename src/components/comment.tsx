import { signIn, useAuthSession } from "@/lib/auth";
import { useCommentSelector } from "@/lib/comment-selector";
import {
  useCommentLikeActions,
  useDeleteComment,
  useUser,
} from "@/lib/database";
import { Comment } from "@/types";
import { FaHeart, FaReply, FaTrash } from "react-icons/fa";
import { MdShare } from "react-icons/md";
import AddComment from "./add-comment";
import Author from "./author";
import { useReplying } from "./single-reply-box-provider";
import { ShareButton } from "./ui/share-button";
import Timedelta from "./ui/timedelta";

export default function CommentCard({
  comment,
  postId,
}: {
  comment: Comment;
  postId: string;
}) {
  const session = useAuthSession();
  const liked = comment.reactedByLoggedInUser?.includes("like");
  const replying = useReplying();
  const deleteComment = useDeleteComment();
  const author = useUser(comment.authorId);
  const { like, unlike } = useCommentLikeActions(postId, comment.id);
  const selectedCommentId = useCommentSelector();

  return (
    <div
      className={`p-4 ${
        selectedCommentId === comment.id
          ? "bg-gray-100 dark:bg-gray-900"
          : "bg-white dark:bg-gray-800"
      }`}
    >
      {author && (
        <Author user={author}>
          <Timedelta dateTime={comment.postedAt} />
          {author.id === session?.user.id && (
            <FaTrash
              className="text-transparent hover:text-gray-500 hover:dark:text-gray-400"
              onClick={() => deleteComment(postId, comment.id)}
            />
          )}
        </Author>
      )}
      <div className="pl-8 mt-3">{comment.content}</div>
      <div className="flex items-center mt-3 pl-8 space-x-4 font-black">
        <button
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-1"
          onClick={liked ? unlike : like}
        >
          <FaHeart className={liked ? "text-red-500" : "text-gray-500"} />
          {comment.reactions?.like
            ? comment.reactions.like === 1
              ? "1 like"
              : `${comment.reactions.like} likes`
            : "Like"}
        </button>
        <button
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-1"
          onClick={() =>
            session
              ? replying.setParentId(
                  comment.id === replying.parentId ? undefined : comment.id
                )
              : signIn(
                  new URL(comment.permalink, window.location.origin).toString()
                )
          }
        >
          <FaReply className="text-gray-500" />
          Reply
        </button>
        <ShareButton
          shareUrl={new URL(comment.permalink, window.location.origin).href}
          variant="none"
          size="none"
          styling="unstyled"
          title={comment.content}
          asChild
        >
          <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-1">
            <MdShare className="text-gray-500" />
            Share
          </button>
        </ShareButton>
      </div>
      {replying.parentId === comment.id && author && (
        <AddComment
          postId={postId}
          parentId={comment.id}
          parentAuthorHandle={author.handle}
          onCancel={() => replying.setParentId(undefined)}
          className="mt-6"
        />
      )}
      {comment.replies && (
        <div className="pl-2 mt-3 border-l-2 border-gray-200 dark:border-gray-700">
          {comment.replies.map((reply) => (
            <CommentCard key={reply.id} comment={reply} postId={postId} />
          ))}
        </div>
      )}
    </div>
  );
}
