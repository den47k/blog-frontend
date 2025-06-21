import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle } from "lucide-react";

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar: string;
  online: boolean;
  isGroup?: boolean;
}

interface ConversationsListViewProps {
  conversations: Conversation[];
}

export const ConversationListView = ({
  conversations,
}: ConversationsListViewProps) => {
  return (
    <ScrollArea className="flex-1 border-t border-zinc-800">
      <div className="p-2">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-zinc-800 cursor-pointer transition-colors"
          >
            <div className="relative flex-shrink-0">
              <Avatar className="h-12 w-12">
                <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
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
  );
};
