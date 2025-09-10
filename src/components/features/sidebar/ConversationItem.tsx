import { useConversation } from "@/stores/chat.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router";
import { formatTimestamp } from "@/lib/utils";

export const ConversationItem = ({ id }: { id: string }) => {
  const conversation = useConversation(id);
  const routeIdentifier = conversation?.userTag ?? conversation?.id ?? id;
  // const { user: currentUser } = useAuth();

  if (!conversation) return;

  const lastMessageContent = conversation.lastMessage
    ? conversation.lastMessage.content
    : "No messages yet";
    
  const timestamp = conversation.lastMessage
    ? conversation.lastMessage.createdAt
    : conversation.createdAt;

  // const otherUser = conversation.type === 'private' ? conversation.participants.find((p) => p.id !== currentUser?.id) : null;

  return (
    <Link to={`/${routeIdentifier}`} className="block">
      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-zinc-800 cursor-pointer transition-colors relative">

        {conversation?.hasUnread && (
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
        )}

        <div className="relative flex-shrink-0">
          <Avatar className="h-12 w-12">
            <AvatarImage src={conversation.avatar?.small || "/placeholder.svg"} />
            <AvatarFallback className="bg-zinc-700 text-zinc-300">
              {conversation.type === 'group' ? (
                <MessageCircle size={20} />
              ) : (
                conversation.title
                  .split(" ")
                  .map((n) => n[0].toUpperCase())
                  .join("")
              )}
            </AvatarFallback>
          </Avatar>
          {/* {conversation.type === 'private' && isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-900" />
          )} */}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1 gap-2">
            <h3 className={`font-medium truncate ${
                conversation?.hasUnread 
                  ? "text-white font-semibold" 
                  : "text-zinc-300"
              }`}>
                {conversation?.title}
              </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-zinc-500">
                {formatTimestamp(timestamp)}
              </span>
            </div>
          </div>
          <p className="text-sm text-zinc-400 truncate pr-2">
            {lastMessageContent}
          </p>
        </div>
      </div>
    </Link>
  );
};
