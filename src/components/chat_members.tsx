import { useChatMembers } from "@/lib/chat";
import { useUser } from "@/lib/database";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function ChatMember({ userId }: { userId: string }) {
  const user = useUser(userId);

  return (
    <div className="flex flex-row items-center gap-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg pr-16 cursor-pointer">
      <Avatar>
        <AvatarImage src={user?.avatar} alt={user?.name} />
        <AvatarFallback>{user?.name}</AvatarFallback>
      </Avatar>
      <span className="text-lg font-bold">{user?.name}</span>
    </div>
  );
}

export default function ChatMembers({ chatId }: { chatId: string }) {
  const members = useChatMembers(chatId);

  return (
    <div className="flex flex-col gap-2">
      {members.map((member) => (
        <ChatMember key={member} userId={member} />
      ))}
    </div>
  );
}
