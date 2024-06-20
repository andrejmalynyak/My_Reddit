import Comment from "@/components/comment";
import Gallery from "@/components/ui/gallery";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/types";
import Author from "./author";
import Timedelta from "./ui/timedelta";
import { BsChatLeftFill } from "react-icons/bs";
import AddComment from "./add-comment";
import { FaEdit, FaHeart, FaSpinner } from "react-icons/fa";
import { MdOutlineCancel, MdSave, MdShare } from "react-icons/md";
import { useReplying } from "./single-reply-box-provider";
import { ShareButton } from "./ui/share-button";
import {
  deleteImage,
  uploadImage,
  usePostLikeActions,
  useUser,
} from "@/lib/database";
import { Button } from "./ui/button";
import { useState } from "react";
import Editor from "./editor";
import { updatePost } from "@/lib/database";
import { useAuthSession } from "@/lib/auth";
import ImageUploader from "./image-uploader";
import Markdown from "./markdown";
import { Link } from "react-router-dom";

export default function PostCard({
  post,
  exclusive,
}: {
  post: Post;
  exclusive?: boolean;
}) {
  const liked = post.reactedByLoggedInUser?.includes("like");
  const replying = useReplying();
  const author = useUser(post.authorId);
  const { like, unlike } = usePostLikeActions(post.id);
  const [notEditing, setNotEditing] = useState(true);
  const [postName, setPostTitle] = useState(post.title);
  const [postContent, setPostContent] = useState(post.content);
  const [postImages, setPostImages] = useState(post.images);
  const [imagesToDelete, setImagesToDelete] = useState<
    { image: string; index: number }[]
  >([]);
  const [imagesToUpload, setImagesToUpload] = useState<File[]>([]);
  const [notUploadedImages, setNotUploadedImages] =
    useState<File[]>(imagesToUpload);
  const [notDeletedImages, setNotDeletedImages] = useState<string[]>(
    postImages || []
  );
  const [saving, setSaving] = useState(false);
  const session = useAuthSession();

  const submitUpdatePost = async () => {
    setSaving(true);
    try {
      let oldImages = postImages;
      for (const file of imagesToUpload) {
        const url = await uploadImage(file, session?.user?.id || "");
        if (!url) {
          console.error("Failed to upload image");
          return "";
        }

        const path = `https://ltabpziqzfhhohokzdfm.supabase.co/storage/v1/object/public/PostImages/${url.path}`;
        oldImages = [...(oldImages ?? []), path];
      }

      for (const { image, index } of imagesToDelete) {
        deleteImage(image.slice(77));
        if (!oldImages) continue;
        oldImages = oldImages.filter((_, i) => i !== index);
      }

      setPostImages(oldImages);
      await updatePost(post.id, {
        images: oldImages,
        title: postName,
        content: postContent,
        author: session?.user?.id || "",
      });
      setNotEditing(true);
      setNotDeletedImages(oldImages || []);
      setNotUploadedImages([]);
      setImagesToUpload([]);
      setImagesToDelete([]);
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <article className="mx-auto w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <div className="flex flex-col p-4">
          <div className="space-around relative flex flex-wrap items-center">
            {author && (
              <Author user={author}>
                <Timedelta dateTime={post.postedAt} />
              </Author>
            )}
            {post.badges && (
              <div className="ml-auto flex space-x-2">
                {post.badges.map((badge) => (
                  <Badge
                    key={badge}
                    className="bg-gray-300 text-gray-500 dark:bg-gray-500 dark:text-gray-300"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            )}
            {author?.id === session?.user?.id && (
              <div className="absolute right-2 flex">
                {notEditing ? (
                  <Button onClick={() => setNotEditing(false)} variant="ghost">
                    <FaEdit className="text-lg text-gray-400 dark:text-gray-200" />
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => {
                        setPostTitle(post.title);
                        setPostContent(post.content);
                        setNotEditing(true);
                      }}
                      variant="ghost"
                    >
                      <MdOutlineCancel className="text-lg text-gray-200" />
                    </Button>
                    <Button onClick={() => submitUpdatePost()} variant="ghost">
                      {saving ? (
                        <FaSpinner className="animate-spin text-gray-200" />
                      ) : (
                        <MdSave className="text-lg text-gray-200" />
                      )}
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
          {notEditing ? (
            <>
              <Link to={post.permalink}>
                <h3 className="mt-3 text-xl font-semibold">{postName}</h3>
              </Link>
              {postImages && postImages.length > 0 && (
                <Gallery images={postImages} />
              )}
              <div className="mt-3 space-y-2">
                <Markdown content={postContent} />
              </div>
            </>
          ) : (
            <div className="mt-3 rounded-md bg-gray-100 p-1 dark:bg-gray-700">
              <input
                type="text"
                placeholder="Post name"
                className="w-full rounded-md bg-transparent p-2 text-white outline-none"
                value={postName}
                onChange={(e) => setPostTitle(e.target.value)}
              />
              <hr />
              <Editor
                value={postContent}
                onChange={setPostContent}
                className="w-full flex-grow self-start"
              />
              <ImageUploader
                imagesToDelete={imagesToDelete}
                setImagesToDelete={setImagesToDelete}
                imagesToUpload={imagesToUpload}
                setImagesToUpload={setImagesToUpload}
                notUploadedImages={notUploadedImages}
                setNotUploadedImages={setNotUploadedImages}
                notDeletedImages={notDeletedImages}
                setNotDeletedImages={setNotDeletedImages}
              />
            </div>
          )}
        </div>
        {/** Reactions - the like button mainly */}
        <div className="flex justify-around p-4">
          <div
            className="flex w-full cursor-pointer flex-col items-center"
            onClick={liked ? unlike : like}
          >
            <FaHeart className={liked ? "text-red-500" : "text-gray-500"} />
            <span className="text-xs font-black text-gray-500 dark:text-gray-300">
              {post.reactions?.like || 0}
            </span>
          </div>
          <div
            className="flex w-full cursor-pointer flex-col items-center"
            onClick={() => replying.setParentId(post.id)}
          >
            <BsChatLeftFill className="text-gray-500" />
            <span className="text-xs font-black text-gray-500 dark:text-gray-300">
              {post.replyCount || post.replies.length}
            </span>
          </div>
          <ShareButton
            shareUrl={new URL(post.permalink, window.location.origin).href}
            variant="none"
            size="none"
            styling="unstyled"
            title={post.title}
            asChild
          >
            <div className="flex w-full cursor-pointer flex-col items-center">
              <MdShare className="text-gray-500" />
              <span className="text-xs font-black text-gray-500 dark:text-gray-300">
                Share
              </span>
            </div>
          </ShareButton>
        </div>
        <AddComment
          postId={post.id}
          parentId={null}
          className={
            post.id === replying.parentId || (exclusive && !replying.parentId)
              ? ""
              : "hidden sm:block"
          }
          parentAuthorHandle={exclusive ? undefined : author?.handle}
          onCancel={() => replying.setParentId(undefined)}
        />
        {post.replies?.map((reply) => (
          <Comment key={reply.id} comment={reply} postId={post.id} />
        ))}
      </article>
    </>
  );
}
