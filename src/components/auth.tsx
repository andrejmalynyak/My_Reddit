import { FaCog, FaGoogle } from "react-icons/fa";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { signIn, useAuthSession } from "@/lib/auth";
import { useUser } from "@/lib/database";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const session = useAuthSession(true);
  const me = useUser(session?.user?.id ?? "");

  const navigate = useNavigate();

  if (!session) {
    return (
      <Button onClick={() => signIn()} className="flex items-center gap-1">
        Sign in with <FaGoogle />
      </Button>
    );
  }

  return (
    <div
      className="flex items-center gap-2 cursor-pointer"
      onClick={() => {
        navigate("/edituser");
      }}
    >
      <Avatar className="w-6 h-6">
        <AvatarImage alt={me?.name} src={me?.avatar} />
        <AvatarFallback>{me?.name[0]}</AvatarFallback>
      </Avatar>
      <FaCog className="w-6 h-6" />
    </div>
  );
}
