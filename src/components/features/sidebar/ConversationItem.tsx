import { Badge } from "@/components/ui/badge";
import { useConversation } from "@/stores/chat.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";

export const ConversationItem = ({ id }: { id: string }) => {
  const conversation = useConversation(id);

  if (!conversation) return;

  console.log(conversation);

  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-zinc-800 cursor-pointer transition-colors">
      <div className="relative flex-shrink-0">
        <Avatar className="h-12 w-12">
          <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
          <AvatarFallback className="bg-zinc-700 text-zinc-300">
            {conversation.isGroup ? (
              <MessageCircle size={20} />
            ) : (
              conversation.title
                .split(" ")
                .map((n) => n[0].toUpperCase())
                .join("")
            )}
          </AvatarFallback>
        </Avatar>
        {!conversation.isGroup && conversation.online && (
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-zinc-900" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1 gap-2">
          <h3 className="text-white font-medium truncate">
            {conversation.title}
          </h3>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-zinc-500">
              {formatTimestamp(conversation.timestamp)}
            </span>
            {conversation.unread > 0 && (
              <Badge className="bg-rose-600 hover:bg-rose-600 text-white text-xs px-2 py-0.5 min-w-[1.5rem] justify-center">
                {conversation.unread > 9 ? "9+" : conversation.unread}
              </Badge>
            )}
          </div>
        </div>
        <p className="text-sm text-zinc-400 truncate pr-2">
          {conversation.lastMessage || "No messages yet"}
        </p>
      </div>
    </div>
  );
};
