import { useAuthSession } from "./auth";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { z } from "zod";
import { Session } from "@supabase/supabase-js";

export type ChatMessage = {
  id: string;
  created_at: Date;
  content: string;
  author: string;
  chat: string;
};

export type Chat = {
  id: string;
  owner: string;
  name: string | null;
};

type ChatsState = {
  chats: Chat[];
  chatMembers: Record<string, string[]>;
  setChats: (chats: Chat[]) => void;
  setChatMembers: (members: Record<string, string[]>) => void;
};

const initialState: ChatsState = {
  chats: [],
  chatMembers: {},
  setChats: () => null,
  setChatMembers: () => null,
};

const ChatsContext = createContext<ChatsState>(initialState);

const fetchChats = async (session: Session | null): Promise<Chat[] | null> => {
  if (!session) return null;
  let { data: chats, error } = await supabase.from("chats").select("*");

  if (error) {
    throw error;
  }
  return z
    .array(
      z.object({
        id: z.string(),
        owner: z.string(),
        name: z.string().nullable(),
      })
    )
    .parse(chats);
};

const useRawChats = () => {
  const session = useAuthSession();
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const fetcher = async () => {
      const chats = await fetchChats(session);
      chats && setChats(chats);
    };
    fetcher();
  }, [session]);

  return chats;
};

const joinChat = async (session: Session, chatId: string) => {
  await supabase.from("chat_participants").insert([
    {
      user_id: session.user.id,
      chat_id: chatId,
    },
  ]);
};

export function ChatsProvider({
  children,
  ...props
}: React.PropsWithChildren<{}>) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatMembers, setChatMembers] = useState<Record<string, string[]>>({});
  const session = useAuthSession(true);

  useEffect(() => {
    const fetcher = async () => {
      const chats = await fetchChats(session);
      chats && setChats(chats);
    };
    fetcher();
  }, [session]);

  const value = {
    chats: chats,
    chatMembers: chatMembers,
    setChats: setChats,
    setChatMembers: setChatMembers,
  };

  return (
    <ChatsContext.Provider {...props} value={value}>
      {children}
    </ChatsContext.Provider>
  );
}

export function useChats() {
  return useContext(ChatsContext);
}

const fetchChatMembers = async (chatId: string): Promise<string[] | null> => {
  let { data: members, error } = await supabase
    .from("chat_participants")
    .select("*")
    .eq("chat_id", chatId);

  if (error) {
    throw error;
  }

  return z
    .array(z.object({ user_id: z.string(), approved: z.boolean() }))
    .parse(members)
    .map((m) => m.user_id);
};

const useChatMembers = (chatId: string): string[] => {
  const session = useAuthSession();
  const [members, setMembers] = useState<string[]>([]);
  const { chatMembers, setChatMembers } = useChats();

  useEffect(() => {
    const fetcher = async () => {
      if (chatMembers[chatId]) {
        setMembers(chatMembers[chatId]);
        return;
      }
      const members = await fetchChatMembers(chatId);

      if (!members) return;

      if (session && members && !members.includes(session.user.id)) {
        await joinChat(session, chatId);
        setMembers([...members, session.user.id]);
        setChatMembers({
          ...chatMembers,
          [chatId]: [...members, session.user.id],
        });
      } else {
        setMembers(members);
        setChatMembers({ ...chatMembers, [chatId]: members });
      }
    };
    fetcher();
  }, [session, chatId]);

  return members;
};

const fetchChatMessages = async (
  chatId: string
): Promise<ChatMessage[] | null> => {
  let { data: messages, error } = await supabase
    .from("chat_messages")
    .select("*")
    .order("created_at", { ascending: true })
    .eq("chat", chatId);

  if (error) {
    throw error;
  }

  return z
    .array(
      z.object({
        id: z.string(),
        created_at: z.preprocess(
          (d) => (typeof d === "string" ? new Date(d) : d),
          z.date()
        ),
        content: z.string(),
        author: z.string(),
        chat: z.string(),
      })
    )
    .parse(messages);
};

const subscribeToChatMessages = (
  chatId: string,
  onMessage: (message: ChatMessage) => void
) => {
  const messageSchema = z.object({
    id: z.string(),
    created_at: z.preprocess(
      (d) => (typeof d === "string" ? new Date(d) : d),
      z.date()
    ),
    content: z.string(),
    author: z.string(),
    chat: z.string(),
  });
  supabase
    .channel(`chat_messages_pub:chat_id=eq.${chatId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public" },
      (payload) => {
        const message = messageSchema.parse(payload.new);
        if (message.chat !== chatId) return;
        onMessage(message);
      }
    )
    .subscribe();
};

const useChatMessages = (chatId: string): ChatMessage[] => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const fetcher = async () => {
      const messages = await fetchChatMessages(chatId);
      messages && setMessages(messages);
    };
    fetcher();
  }, [chatId]);

  useEffect(() => {
    const onMessage = (message: ChatMessage) => {
      // Deduplicate messages:
      setMessages((messages) =>
        messages.find((m) => m.id === message.id)
          ? messages
          : [...messages, message]
      );
    };
    subscribeToChatMessages(chatId, onMessage);
  }, [chatId]);

  return messages;
};

const sendMessage = async (
  session: Session,
  chatId: string,
  content: string
) => {
  await supabase.from("chat_messages").insert([
    {
      chat: chatId,
      content: content,
      author: session.user.id,
    },
  ]);
};

const createChat = async (
  session: Session,
  name: string | null
): Promise<Chat> => {
  // Should both create a chats entry and a chat_participants entry,
  // with the current user as the only participant.
  const { data: result } = await supabase
    .from("chats")
    .insert([
      {
        owner: session.user.id,
        name: name,
      },
    ])
    .select();

  return z
    .object({
      id: z.string(),
      owner: z.string(),
      name: z.string().nullable(),
    })
    .parse(result && result[0]);
};

const useChatCreator = (): ((name: string | null) => void) => {
  const session = useAuthSession();
  const { chats, setChats } = useChats();

  return async (name: string | null) => {
    if (!session) return;

    const chat = await createChat(session, name);
    setChats([...chats, chat]);
    await joinChat(session, chat.id);
  };
};

const renameChat = async (chatId: string, name: string | null) => {
  await supabase.from("chats").update({ name: name }).eq("id", chatId);
};

const useChatRenamer = (chatId: string): ((name: string | null) => void) => {
  const { chats, setChats } = useChats();

  return async (name: string | null) => {
    await renameChat(chatId, name);
    setChats(
      chats.map((chat) => {
        if (chat.id === chatId) {
          return { ...chat, name: name };
        } else {
          return chat;
        }
      })
    );
  };
};

const deleteChat = async (chatId: string) => {
  await supabase.from("chats").delete().eq("id", chatId);
};

const useChatDeleter = (chatId: string): (() => void) => {
  const { chats, setChats } = useChats();

  return async () => {
    await deleteChat(chatId);
    setChats(chats.filter((chat) => chat.id !== chatId));
  };
};

const addChatMember = async (chatId: string, userId: string) => {
  await supabase.from("chat_participants").insert([
    {
      chat_id: chatId,
      user_id: userId,
    },
  ]);
};

const createChatWithUser = async (
  session: Session,
  name: string | null,
  userId: string
): Promise<Chat> => {
  const chat = await createChat(session, name);
  await addChatMember(chat.id, userId);
  return chat;
};

const useChatCreatorWithUser = (): ((
  name: string | null,
  userId: string
) => Promise<string | null>) => {
  const session = useAuthSession();
  const { chats, setChats } = useChats();

  return async (name: string | null, userId: string) => {
    if (!session) return null;

    // We first check whether the chat we want to create already exists.
    const existingChat = chats.find((chat) => {
      return chat.owner === session.user.id && chat.name === name;
    });
    if (existingChat) return existingChat.id;

    // Maybe we're the owner - then we need to fetch the members of all *our* chats
    const ourChats = chats.filter((chat) => chat.owner === session.user.id);
    const ourMembers = await Promise.all(
      ourChats.map((chat) => fetchChatMembers(chat.id))
    );
    const ourMemberIds = ourMembers.reduce<string[]>(
      (acc, members) => [...acc, ...(members || [])],
      []
    );
    if (ourMemberIds.includes(userId)) {
      return (
        ourChats.find((_, i) => ourMembers[i]?.includes(userId))?.id || null
      );
    }

    const chat = await createChatWithUser(session, name, userId);
    setChats([...chats, chat]);
    return chat.id;
  };
};

export {
  useRawChats,
  useChatMembers,
  useChatMessages,
  sendMessage,
  useChatCreator,
  useChatRenamer,
  useChatDeleter,
  addChatMember,
  useChatCreatorWithUser,
};
