import { useSearchUsers } from "@/lib/database";
import { useState } from "react";
import Author from "./components/author";

export default function UserSearch() {
  const [query, setQuery] = useState("");
  const users = useSearchUsers(query);

  let atLeastOne = false;
  const authors = users.map((user) => {
    atLeastOne = true;
    return <Author key={user.id} user={user} />;
  });

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex flex-col items-stretch w-full max-w-96 justify-center">
        <input
          className="rounded-md bg-gray-50 dark:bg-gray-700 p-1"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {atLeastOne && (
          <div className="rounded-md bg-zinc-100 dark:bg-gray-700 p-2">
            {authors}
          </div>
        )}
      </div>
    </div>
  );
}
