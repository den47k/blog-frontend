import { Menu, MessageCircle, SearchIcon, UserPlusIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";

export const AppSidebar = () => {
  const conversations = [
    {
      id: 1,
      name: "Sarah Johnson",
      lastMessage: "Hey! How's your day going?",
      timestamp: "2m",
      unread: 2,
      avatar: "/placeholder.svg?height=40&width=40",
      online: true,
    },
    {
      id: 2,
      name: "Dev Team",
      lastMessage: "Alice: The new feature is ready for testing",
      timestamp: "15m",
      unread: 0,
      avatar: "/placeholder.svg?height=40&width=40",
      online: false,
      isGroup: true,
    },
    {
      id: 3,
      name: "Mike Chen",
      lastMessage: "Thanks for the help earlier!",
      timestamp: "1h",
      unread: 0,
      avatar: "/placeholder.svg?height=40&width=40",
      online: true,
    },
    {
      id: 4,
      name: "Emma Wilson",
      lastMessage: "Can we schedule a call tomorrow?",
      timestamp: "2h",
      unread: 1,
      avatar: "/placeholder.svg?height=40&width=40",
      online: false,
    },
    {
      id: 5,
      name: "Project Alpha",
      lastMessage: "John: Meeting notes uploaded",
      timestamp: "3h",
      unread: 0,
      avatar: "/placeholder.svg?height=40&width=40",
      online: false,
      isGroup: true,
    },
    {
      id: 6,
      name: "Lisa Park",
      lastMessage: "See you at the conference!",
      timestamp: "1d",
      unread: 0,
      avatar: "/placeholder.svg?height=40&width=40",
      online: false,
    },
  ];

  return (
    <div className="w-96 bg-zinc-900 border-r-2 border-zinc-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b-2 border-zinc-700">
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

      {/* Conversations List */}
      <ScrollArea className="flex-1 border-t border-zinc-800">
        <div className="p-2">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-zinc-800 cursor-pointer transition-colors"
            >
              <div className="relative flex-shrink-0">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={conversation.avatar || "/placeholder.svg"}
                  />
                  <AvatarFallback className="bg-zinc-700 text-zinc-300">
                    {conversation.isGroup ? (
                      <MessageCircle size={20} />
                    ) : (
                      conversation.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    )}
                  </AvatarFallback>
                </Avatar>
                {conversation.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-zinc-900"></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1 gap-2">
                  <h3 className="text-white font-medium truncate">
                    {conversation.name}
                  </h3>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-zinc-500">
                      {conversation.timestamp}
                    </span>
                    {conversation.unread > 0 && (
                      <Badge className="bg-rose-600 hover:bg-rose-600 text-white text-xs px-2 py-0.5 min-w-[1.5rem] justify-center">
                        {conversation.unread}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-zinc-400 truncate pr-2">
                  {conversation.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
