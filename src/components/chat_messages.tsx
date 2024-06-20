import { useChatMessages } from "@/lib/chat";
import { useUser } from "@/lib/database";
import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import DiscordInvite from "./ui/discord-invite";

function ChatMessage({
  author,
  content,
  mergeWithPrev,
}: {
  author: string;
  content: string;
  mergeWithPrev?: boolean;
}) {
  const user = useUser(author);

  return mergeWithPrev ? (
    <div className="flex flex-row items-start gap-4 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-950">
      <span className="w-8" />
      <div className="flex flex-col">
        <p>{content}</p>
      </div>
    </div>
  ) : (
    <div className="flex flex-row items-start gap-4 pt-2 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-950">
      <Avatar className="w-8 h-8">
        <AvatarImage src={user?.avatar} alt={user?.name} />
        <AvatarFallback>{user?.name}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-lg font-bold cursor-pointer">{user?.name}</span>
        <p>{content}</p>
      </div>
    </div>
  );
}

export default function ChatMessages({
  chatId,
  owner,
}: {
  chatId: string;
  owner?: User | null;
}) {
  const messages = useChatMessages(chatId);

  return (
    <div className="flex flex-col justify-end gap-0 w-full p-4 overflow-y-auto">
      {owner && (
        <span className="text-xs self-center p-2 text-gray-500 dark:text-gray-400">
          This chat is owned by @{owner.handle}
        </span>
      )}
      <span className="flex flex-col items-center gap-4 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-950">
        Цей сайт - для балів з вебу, насправді ми вас в діскорді чекаємо!
        <DiscordInvite
          link="https://discord.gg/mnwByZAS"
          name="УКУ: Прикладні науки"
          icon="/logo.png"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-full text-nowrap text-ellipsis overflow-hidden">
            ФПН має діскорд-сервер :3
          </p>
        </DiscordInvite>
      </span>
      <span className="text-xs self-center p-2 text-gray-500 dark:text-gray-400">
        This is the beginning of the chat. Say hi!
      </span>
      <span className="text-xs self-center p-2 text-gray-500 dark:text-gray-400">
        Note that while nobody can kick you out of the chat, new members can be
        added at any time. Be nice!
      </span>
      {messages.map((message, i) => (
        <ChatMessage
          key={message.id}
          author={message.author}
          content={message.content}
          mergeWithPrev={i > 0 && messages[i - 1].author === message.author}
        />
      ))}
    </div>
  );
}
