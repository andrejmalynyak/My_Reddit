import { useState } from "react";
import Editor from "./editor";
import { Button } from "./ui/button";
import { MdSend } from "react-icons/md";
import { createPost, deleteImage, uploadImage, useUser } from "@/lib/database";
import { useAuthSession } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import ImageUploader from "./image-uploader";
import { FaSpinner } from "react-icons/fa";

export default function NewPost() {
  const [post, setPost] = useState("");
  const [postName, setPostName] = useState("");
  const [imagesToDelete, setImagesToDelete] = useState<
    { image: string; index: number }[]
  >([]);
  const [imagesToUpload, setImagesToUpload] = useState<File[]>([]);
  const [notUploadedImages, setNotUploadedImages] =
    useState<File[]>(imagesToUpload);
  const [notDeletedImages, setNotDeletedImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const session = useAuthSession();
  const me = useUser(session?.user?.id || "");
  const navigate = useNavigate();
  const submit = async () => {
    setSaving(true);
    try {
      let images: string[] = [];
      for (const file of imagesToUpload) {
        const url = await uploadImage(file, session?.user?.id || "");
        if (!url) {
          console.error("Failed to upload image");
          return "";
        }

        const path = `https://ltabpziqzfhhohokzdfm.supabase.co/storage/v1/object/public/PostImages/${url.path}`;
        images = [...(images ?? []), path];
      }

      for (const { image, index } of imagesToDelete) {
        deleteImage(image.slice(77));
        if (!images) continue;
        images = images.filter((_, i) => i !== index);
      }

      setNotUploadedImages([]);
      setImagesToUpload([]);
      setPost("");
      await createPost({
        title: postName,
        content: post,
        images,
        author: session?.user?.id || "",
      });
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setSaving(false);
      navigate("/");
    }
  };

  if (!session) {
    return <div>Log in to create a post</div>;
  }

  return (
    <div className="mt-16 flex h-fit max-w-2xl flex-col items-end rounded-md bg-input md:mx-auto">
      <div className="w-full self-start rounded-md bg-gray-300 dark:bg-gray-900 flex">
        <Avatar className="self-start rounded-md p-2">
          <AvatarImage
            src={me?.avatar}
            alt={me?.name}
            className="rounded-full"
          />
          <AvatarFallback>{me?.name?.[0]}</AvatarFallback>
        </Avatar>
        <input
          type="text"
          placeholder="Post name"
          className="w-full rounded-md bg-gray-300 dark:bg-gray-900 p-2 text-black dark:text-white outline-none"
          value={postName}
          onChange={(e) => setPostName(e.target.value)}
        />
      </div>
      <Editor
        value={post}
        onChange={setPost}
        className="flex-grow self-start w-full"
      />
      <Button variant="none" onClick={submit}>
        {saving ? <FaSpinner className="animate-spin" /> : <MdSend />}
      </Button>
      <ImageUploader
        imagesToDelete={imagesToDelete}
        setImagesToDelete={setImagesToDelete}
        imagesToUpload={imagesToUpload}
        setImagesToUpload={setImagesToUpload}
        notUploadedImages={notUploadedImages}
        setNotUploadedImages={setNotUploadedImages}
        notDeletedImages={notDeletedImages}
        setNotDeletedImages={setNotDeletedImages}
        className="self-start p-4"
      />
    </div>
  );
}
