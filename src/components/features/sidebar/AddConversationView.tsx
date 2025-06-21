import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useApi from "@/hooks/useApi";
import { ArrowLeftIcon, AtSign, UserIcon } from "lucide-react";
import { useState } from "react";

interface AddConversationViewProps {
  onBackClick: () => void;
}

export const AddConversationView = ({
  onBackClick,
}: AddConversationViewProps) => {
  const [chatType, setChatType] = useState<"private" | "group">("private");

  return (
    <div className="flex-1 flex flex-col">
      {/* Add Chat Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center space-x-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-zinc-400 hover:text-white hover:bg-zinc-800"
            onClick={onBackClick}
          >
            <ArrowLeftIcon size={18} />
          </Button>
          <h3 className="text-white font-semibold">New Conversation</h3>
        </div>

        {/* Chat Type Tabs */}
        <div className="flex space-x-1 bg-zinc-800 rounded-lg p-1">
          <button
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              chatType === "private"
                ? "bg-rose-600 text-white"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
            onClick={() => setChatType("private")}
          >
            <AtSign size={16} />
            <span>Private</span>
          </button>
          <button
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              chatType === "group"
                ? "bg-rose-600 text-white"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
            onClick={() => setChatType("group")}
          >
            <UserIcon size={16} />
            <span>Group</span>
          </button>
        </div>
      </div>

      {/* Add Chat Content */}
      <div className="flex-1 p-4">
        {chatType === "private" ? (
          <PrivateConversationView />
        ) : (
          <GroupConversationView />
        )}
      </div>
    </div>
  );
};

const PrivateConversationView = () => {
  const { post } = useApi();

  const suggestedUsers = [
    {
      name: "Alex Thompson",
      username: "@alexthompson",
      avatar: "/placeholder.svg?height=32&width=32",
      online: true,
    },
    {
      name: "Maria Garcia",
      username: "@mariagarcia",
      avatar: "/placeholder.svg?height=32&width=32",
      online: false,
    },
    {
      name: "David Kim",
      username: "@davidkim",
      avatar: "/placeholder.svg?height=32&width=32",
      online: true,
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Find User
        </label>
        <Input
          placeholder="Enter username or tag..."
          className="bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-500 focus:border-rose-500 focus:ring-rose-500"
        />
        <p className="text-xs text-zinc-500 mt-1">
          Search by username or @tag
        </p>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-zinc-400">Suggested Users</h4>
        {suggestedUsers.map((user, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-zinc-800 cursor-pointer transition-colors"
          >
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-zinc-700 text-zinc-300">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {user.online && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-900"></div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">{user.name}</p>
              <p className="text-sm text-zinc-400">{user.username}</p>
            </div>
            <Button
              size="sm"
              className="bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
              onClick={() => post('/conversations/private', {
                'recipient_tag': 'm3ss1'
              })}
            >
              Chat
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

const GroupConversationView = () => {
  const publicGroups = [
    {
      name: "Web Developers",
      members: 1247,
      description: "Discussion about web development",
      id: "#webdev",
    },
    {
      name: "Design Community",
      members: 892,
      description: "UI/UX designers sharing ideas",
      id: "#design",
    },
    {
      name: "Tech News",
      members: 2156,
      description: "Latest technology news and updates",
      id: "#technews",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white justify-start">
          <UserIcon size={18} className="mr-2" />
          Create New Group
        </Button>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 top-1/2 flex items-center w-full">
            <div className="w-full border-t border-zinc-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-zinc-900 px-2 text-zinc-500">or</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Find Group
          </label>
          <Input
            placeholder="Enter group name or ID..."
            className="bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-500 focus:border-rose-500 focus:ring-rose-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-zinc-400">Public Groups</h4>
        {publicGroups.map((group, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-zinc-800 cursor-pointer transition-colors"
          >
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-zinc-700 text-zinc-300">
                <UserIcon size={20} />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="text-white font-medium">{group.name}</p>
                <span className="text-xs text-zinc-500">{group.id}</span>
              </div>
              <p className="text-sm text-zinc-400 truncate">
                {group.description}
              </p>
              <p className="text-xs text-zinc-500">
                {group.members.toLocaleString()} members
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="bg-transparent border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              Join
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
