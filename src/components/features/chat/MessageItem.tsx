import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { formatTimestamp } from "@/lib/utils";
import type { Message } from "@/types";
import { Check, CheckCheck } from "lucide-react";
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
      <div className="max-w-xs lg:max-w-md min-w-[100px]">
        <div className={`rounded-2xl px-4 py-2 ${isOwn ? "bg-rose-600 text-white" : "bg-zinc-800 text-zinc-200"}`}>
          <p className="text-sm">{message.content}</p>
        </div>
        <div className={`flex items-center gap-1 mt-1 pl-1 ${isOwn ? "justify-between" : "justify-start"}`}>
          <p className={`text-xs text-zinc-500 mt-1 ${isOwn ? "text-right" : "text-left"}`}>{formatTimestamp(message.createdAt)}</p>
          {isOwn && <StatusIndicator status={message.status} />}
        </div>
      </div>
    </div>
  );
});


const StatusIndicator = ({ status }: { status: Message["status"] }) => {
  switch (status) {
    case "sent":
      return <Check className="h-3 w-3 text-zinc-400" />
    case "read":
      return <CheckCheck className="h-4 w-4 text-rose-400" />
    default:
      return null
  }
};