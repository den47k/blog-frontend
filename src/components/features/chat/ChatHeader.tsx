import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Conversation } from "@/types";
import { InfoIcon, MoreVerticalIcon } from "lucide-react";

interface ChatHeaderProps {
  conversation: Conversation;
}

export const ChatHeader = ({ conversation }: ChatHeaderProps) => {
  // const { user: currentUser } = useAuth();
  // const otherUser = conversation.type === 'private' ? conversation.participants.find((p) => p.id !== currentUser?.id) : null;

  return (
    <div className="bg-zinc-900 border-b border-zinc-800 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={conversation.avatar?.small || "/placeholder.svg"} />
              <AvatarFallback className="bg-zinc-700 text-zinc-300">
                {conversation.title.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            {/* {true && (<div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-900"></div>)} */}
          </div>
          <div>
            <h2 className="text-white font-semibold">{conversation.title}</h2>

            {conversation.type === "private" && (
              <div className="text-xs text-muted-foreground">
                {/* {true ? (
                  <p className="text-green-400">Online</p>
                ) : conversation.lastSeenAt ? (
                  `Last seen ${formatTimestamp(conversation.lastSeenAt)} ago`
                ) : null} */}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <InfoIcon size={18} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <MoreVerticalIcon size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};
