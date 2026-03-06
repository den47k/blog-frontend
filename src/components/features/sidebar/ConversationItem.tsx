import { useConversation } from "@/stores/chat.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router";
import { formatConversationTime } from "@/lib/utils";

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

    return (
        <Link to={`/${routeIdentifier}`} className="block">
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-zinc-800 cursor-pointer transition-colors relative">
                {conversation?.hasUnread && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                )}

                <div className="relative flex-shrink-0">
                    <Avatar className="h-12 w-12">
                        <AvatarImage
                            src={
                                conversation.avatar?.small || "/placeholder.svg"
                            }
                        />
                        <AvatarFallback className="bg-zinc-700 text-zinc-300">
                            {conversation.type === "group" ? (
                                <MessageCircle size={20} />
                            ) : (
                                conversation.title
                                    .split(" ")
                                    .map((n) => n[0].toUpperCase())
                                    .join("")
                            )}
                        </AvatarFallback>
                    </Avatar>
                </div>

                <div className="w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-2">
                        <h3
                            className={`truncate ${
                                conversation?.hasUnread
                                    ? "font-semibold text-white"
                                    : "font-medium text-zinc-300"
                            }`}
                        >
                            {conversation?.title}
                        </h3>

                        <span className="shrink-0 text-xs text-zinc-500">
                            {formatConversationTime(timestamp)}
                        </span>
                    </div>

                    <p className="truncate pr-2 text-sm text-zinc-400">
                        {lastMessageContent}
                    </p>
                </div>
            </div>
        </Link>
    );
};
