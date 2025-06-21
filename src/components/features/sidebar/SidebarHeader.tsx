import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, SearchIcon, UserPlusIcon } from "lucide-react";

interface SidebarHeaderProps {
  onAddChatClick: () => void;
}

export const SidebarHeader = ({ onAddChatClick }: SidebarHeaderProps) => {
  return (
    <div className="p-4 border-b border-zinc-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback className="bg-rose-600 text-white">
              JD
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h2 className="text-white font-semibold truncate">John Doe</h2>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
              <span className="text-xs text-zinc-400">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="text-zinc-400 hover:text-white hover:bg-zinc-800"
            onClick={onAddChatClick}
          >
            <UserPlusIcon size={18} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <Menu size={18} />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <SearchIcon
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 flex-shrink-0"
          size={18}
        />
        <Input
          placeholder="Search conversations..."
          className="pl-10 bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-500 focus:border-rose-500 focus:ring-rose-500"
        />
      </div>
    </div>
  );
};
