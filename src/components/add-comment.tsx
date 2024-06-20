import { useAuthSession } from "@/lib/auth";
import { useReplier, useUser } from "@/lib/database";
import { cn } from "@/lib/utils";
import { FormEvent, useState } from "react";
import { MdClose, MdSend } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Editor from "./editor";

export default function AddComment({
  postId,
  parentId,
  parentAuthorHandle,
  onCancel,
  className,
}: {
  postId: string;
  parentId: string | null;
  parentAuthorHandle?: string;
  onCancel?: () => void;
  className?: string;
}) {
  const [content, setContent] = useState("");
  const session = useAuthSession();
  const reply = useReplier();
  const me = useUser(session?.user.id ?? "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    reply({ postId, parentId, content });
    setContent("");
    onCancel?.();
  };

  return (
    session && (
      <form
        onSubmit={handleSubmit}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-10 overflow-hidden rounded-t-lg bg-gray-300 dark:bg-gray-600 sm:static sm:rounded-lg sm:bg-transparent",
          className
        )}
      >
        {parentAuthorHandle && (
          <div className="flex items-center justify-between p-2 text-sm text-gray-500 dark:text-gray-400 sm:hidden">
            <span>Replying to @{parentAuthorHandle}</span>
            {onCancel && (
              <MdClose className="cursor-pointer" onClick={onCancel} />
            )}
          </div>
        )}
        <div className="flex flex-row items-stretch overflow-hidden rounded-lg bg-gray-300 dark:bg-gray-600 sm:bg-gray-200">
          <span className="p-2">
            <Avatar className="h-6 w-6">
              <AvatarImage alt={me?.name} src={me?.avatar} />
              <AvatarFallback>{me?.name[0]}</AvatarFallback>
            </Avatar>
          </span>
          <Editor value={content} onChange={setContent} className="w-full" />
          <button
            type="submit"
            className="rounded-none bg-gray-300 p-2 dark:bg-gray-600 sm:bg-gray-200"
          >
            <MdSend />
          </button>
        </div>
      </form>
    )
  );
}
