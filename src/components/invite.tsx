import DiscordInvite from "./ui/discord-invite";

export default function Invite({
  link,
  title,
  icon,
  preamble,
  children,
  notice,
  online,
  total,
}: {
  link: string;
  title: string;
  icon: string;
  preamble?: string;
  children?: React.ReactNode;
  notice?: string;
  online?: number;
  total?: number;
}) {
  return (
    <div className="p-4 flex flex-col gap-1 items-start justify-center">
      {preamble && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{preamble}</p>
      )}
      <DiscordInvite
        name={title}
        icon={icon}
        link={link}
        online={online}
        total={total}
      >
        {children}
      </DiscordInvite>
      {notice && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{notice}</p>
      )}
    </div>
  );
}
