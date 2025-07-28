import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { formatTimestamp } from "@/lib/utils";
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

      {/* <div className="max-w-xs lg:max-w-md min-w-[100px]">
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwn 
              ? "bg-rose-600 text-white rounded-tr-none" 
              : "bg-zinc-800 text-zinc-200 rounded-tl-none"
          }`}
        >

          <p className="text-sm whitespace-break-spaces break-words pb-5">
            {message.content}
          </p>
          
          <div className="flex justify-end -mt-5 h-5">
            <span className={`text-xs ${isOwn ? "text-rose-200" : "text-zinc-500"}`}>
              {formatTimestamp(message.createdAt)}
            </span>
          </div>
        </div>
      </div> */}

      <div className="max-w-xs lg:max-w-md min-w-[100px]">
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwn 
              ? "bg-rose-600 text-white rounded-br-none" 
              : "bg-zinc-800 text-zinc-200 rounded-bl-none"
          }`}
        >
          <div className="flex justify-between items-end gap-3">
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </p>
            <span 
              className={`flex-shrink-0 text-xs ${
                isOwn ? "text-rose-200" : "text-zinc-500"
              }`}
              style={{minWidth: "fit-content"}}
            >
              {formatTimestamp(message.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});