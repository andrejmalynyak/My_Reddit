import { ReactNode } from "react";
import Checkmark from "./checkmark";

export default function DiscordInvite({
  link,
  name,
  icon,
  online,
  total,
  children,
}: {
  link: string;
  name: string;
  icon: string;
  online?: number;
  total?: number;
  children?: ReactNode;
}) {
  return (
    <div className="text-black dark:text-white bg-zinc-200 dark:bg-zinc-700/70 rounded p-4 w-96 min-w-10 flex flex-col max-w-full cursor-default">
      <div className="font-bold mb-3 whitespace-nowrap text-ellipsis overflow-hidden text-gray-600 dark:text-gray-400 uppercase font-sans text-xs">
        You've been invited to join a server
      </div>
      <div className="flex flex-row flex-wrap gap-4">
        <div className="flex flex-row flex-nowrap gap-4 grow items-center">
          <img className="w-14 h-14 rounded-2xl" src={icon} alt={name} />
          <div className="flex flex-col flex-nowrap whitespace-nowrap overflow-hidden">
            <div className="flex flex-row gap-1 items-center">
              <Checkmark type="moderator" />
              <span className="font-semibold text-ellipsis overflow-hidden">
                {name}
              </span>
            </div>
            {(online || total) && (
              <div className="flex flex-row gap-3 items-center text-sm font-normal text-gray-600 dark:text-gray-400">
                {online && (
                  <span className="flex items-center gap-1">
                    <span className="bg-green-600 rounded-full w-2 h-2" />
                    {online} Online
                  </span>
                )}
                {total && (
                  <span className="flex items-center gap-1">
                    <span className="bg-gray-500 rounded-full w-2 h-2" />
                    {total} Members
                  </span>
                )}
              </div>
            )}
            {children}
          </div>
        </div>
        <a
          href={link}
          className="text-inherit h-10 px-4 rounded flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold text-sm flex-grow"
          target="_blank"
          rel="noopener noreferrer"
        >
          Join
        </a>
      </div>
    </div>
  );
}
