import { Chat } from "@/lib/chat";
import { useUser } from "@/lib/database";
import ChatInput from "./chat_input";
import ChatMembers from "./chat_members";
import ChatMessages from "./chat_messages";

export default function ChatComponent({ chat }: { chat: Chat }) {
  const chatOwner = useUser(chat.owner);

  return (
    <div className="flex flex-row gap-4 w-full h-full">
      <div className="flex flex-col gap-4 w-full h-full">
        <ChatMessages chatId={chat.id} owner={chatOwner} />
        <ChatInput chatId={chat.id} />
      </div>
      <ChatMembers chatId={chat.id} />
    </div>
  );
}
