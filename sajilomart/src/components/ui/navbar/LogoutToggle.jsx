import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { useDispatch } from "react-redux";
import { setUserLogout } from "@/Redux/ReduxSlice/authslice";
import { useNavigate } from "react-router-dom";

const LogoutToggle = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(setUserLogout());
  };

  const handleOrderClick = () => {
    navigate("/order");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative cursor-pointer flex-shrink-0">
          <Avatar className="w-8 sm:w-9 h-8 sm:h-9 border-2 border-slate-200 dark:border-slate-700 shadow-md">
            <AvatarFallback className="text-xs sm:text-sm font-bold bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              {user?.name?.charAt(0)?.toUpperCase() || "D"}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl"
      >
        <DropdownMenuLabel className="px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
          {user?.name || "User"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
        <DropdownMenuItem
          onSelect={handleOrderClick}
          className="px-3 py-2 text-sm rounded-lg cursor-pointer text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-150"
        >
          📦 My Orders
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={handleLogout}
          className="px-3 py-2 text-sm rounded-lg cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-150"
        >
          🚪 Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LogoutToggle;
