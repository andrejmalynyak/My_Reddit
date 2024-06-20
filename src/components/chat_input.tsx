import { useAuthSession } from "@/lib/auth";
import { sendMessage } from "@/lib/chat";
import { useState } from "react";
import { Button } from "./ui/button";
import Editor from "./editor";

export default function ChatInput({ chatId }: { chatId: string }) {
  const session = useAuthSession();
  const [message, setMessage] = useState("");

  if (!session) {
    return <div>Log in to send messages</div>;
  }

  return (
    <form
      onSubmit={(e) => {
        sendMessage(session, chatId, message);
        setMessage("");
        e.preventDefault();
      }}
      className="flex w-full items-center gap-2 p-4 mt-auto"
    >
      <Editor
        value={message}
        onChange={setMessage}
        className="w-full bg-input rounded-md"
      />
      <Button type="submit">Send</Button>
    </form>
  );
}
