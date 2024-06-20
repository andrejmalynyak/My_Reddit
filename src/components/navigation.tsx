import { Link } from "react-router-dom";
import Auth from "./auth";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { FaHome, FaSearch } from "react-icons/fa";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { MdOutlinePostAdd } from "react-icons/md";

export default function Navigation() {
  return (
    <div className="fixed bottom-0 z-10 flex h-16 w-full items-center gap-2 bg-gray-900 p-4 md:bottom-auto md:top-0">
      <Link to="/">
        <Button
          className="text-lg p-4 hover:bg-gray-700 bg-gray-800 rounded-full text-white"
          size="none"
        >
          <FaHome />
        </Button>
      </Link>
      <Link to="/chats">
        <Button
          className="text-lg p-4 hover:bg-gray-700 bg-gray-800 rounded-full text-white"
          size="none"
        >
          <IoChatboxEllipsesOutline />
        </Button>
      </Link>
      <Link to="/latest">
        <Button
          className="text-lg p-4 hover:bg-gray-700 bg-gray-800 rounded-full text-white"
          size="none"
        >
          <MdOutlinePostAdd />
        </Button>
      </Link>
      <Link to="/search">
        <Button
          className="text-lg p-4 hover:bg-gray-700 bg-gray-800 rounded-full text-white"
          size="none"
        >
          <FaSearch />
        </Button>
      </Link>
      <div className="self-end ml-auto flex items-center gap-2 p-4 h-full">
        <ModeToggle />
        <Auth />
      </div>
    </div>
  );
}
