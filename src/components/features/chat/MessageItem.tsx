import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import type { Message } from "@/types";
import { memo } from "react";

interface MessageItemProps {
  message: Message;
}

export const MessageItem = memo(({ message }: MessageItemProps) => {
  const { user } = useAuth();
  const isOwn = message.senderId === user?.id;

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} space-x-2`}>
      {!isOwn && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={message.sender.avatar || "/placeholder.svg"} />
          <AvatarFallback className="bg-zinc-700 text-zinc-300 text-xs">{message.sender.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
      )}
      <div className="max-w-xs lg:max-w-md">
        <div className={`rounded-2xl px-4 py-2 ${isOwn ? "bg-rose-600 text-white" : "bg-zinc-800 text-zinc-200"}`}>
          <p className="text-sm">{message.content}</p>
        </div>
        <p className={`text-xs text-zinc-500 mt-1 ${isOwn ? "text-right" : "text-left"}`}>
          {message.createdAt}
        </p>
      </div>
    </div>
  );
});