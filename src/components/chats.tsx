import {
  Chat,
  useChatCreator,
  useChatDeleter,
  useChatMembers,
  useChatRenamer,
  useChats,
} from "@/lib/chat";
import { useUser } from "@/lib/database";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import ChatComponent from "./chat";

function MemberPreview({ userId }: { userId: string }) {
  const user = useUser(userId);

  return <>{user?.name ?? ""}</>;
}

function ChatPreview({
  chat,
  activeChat,
  setActiveChat,
}: {
  chat: Chat;
  activeChat: Chat | null;
  setActiveChat: (chat: Chat | null) => void;
}) {
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(chat.name || "");
  const members = useChatMembers(chat.id);

  const renameChat = useChatRenamer(chat.id);
  const deleteChat = useChatDeleter(chat.id);

  return (
    <span
      key={chat.id}
      onClick={() => setActiveChat(chat)}
      onDoubleClick={() => {
        setRenaming(true);
        document.addEventListener("click", () => setRenaming(false), {
          once: true,
        });
      }}
      className={`group flex cursor-pointer flex-row items-center justify-around gap-8 whitespace-nowrap rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${
        chat.id === activeChat?.id ? "bg-gray-100 dark:bg-gray-800" : ""
      }`}
    >
      {renaming ? (
        <input
          value={newName}
          autoFocus
          className="w-16 border-none bg-transparent outline-none focus:ring-0 focus:ring-transparent"
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              renameChat(newName);
              setRenaming(false);
            }
          }}
        />
      ) : (
        chat.name ||
        members
          .filter((member) => member !== chat.owner)
          .map((member: string) => (
            <MemberPreview key={member} userId={member} />
          )) ||
        "Unnamed Chat"
      )}
      <FaTrash
        className="text-transparent group-hover:text-gray-500 group-hover:dark:text-gray-400"
        onClick={(e) => {
          e.stopPropagation();
          deleteChat();
          setActiveChat(null);
        }}
      />
    </span>
  );
}

export default function Chats() {
  const { chats } = useChats();
  const { chatId } = useParams();
  const createChat = useChatCreator();
  const activeChat = chats.find((chat) => chat.id === chatId) ?? null;
  const navigate = useNavigate();

  return (
    <div className="pd-2 fixed bottom-0 top-16 flex w-full flex-row gap-4 pl-2 pr-2">
      <div className="flex flex-col gap-4">
        <span className="p-2 text-2xl font-bold">Chats</span>
        {chats
          .sort((a, b) => (a.name || a.id).localeCompare(b.name || b.id))
          .map((chat) => (
            <ChatPreview
              key={chat.id}
              chat={chat}
              activeChat={activeChat}
              setActiveChat={(chat) =>
                chat ? navigate(`/chats/${chat.id}`) : navigate("/chats")
              }
            />
          ))}
        <span
          onClick={() => createChat(null)}
          className="cursor-pointer whitespace-nowrap rounded-lg p-2 pr-16 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          New Chat
        </span>
      </div>
      {activeChat && <ChatComponent chat={activeChat} />}
    </div>
  );
}
