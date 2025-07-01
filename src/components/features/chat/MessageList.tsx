import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageItem } from "./MessageItem";
import { memo, useEffect, useRef } from "react";
import { useMessages } from "@/hooks/useChatApi";

interface MessageListProps {
  conversationId: string | null;
}

export const MessageList = memo(({ conversationId }: MessageListProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, error } = useMessages(conversationId);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight });
    }
  }, [messages]);

  if (isLoading) return <div className="flex-1 flex items-center justify-center"><p>Loading messages...</p></div>;
  if (error) return <div className="flex-1 flex items-center justify-center"><p>Failed to load messages.</p></div>;
  
  return (
    <ScrollArea className="flex-1 min-h-0 bg-zinc-950" ref={scrollAreaRef}>
      <div className="p-4 space-y-4">
        {messages?.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </div>
    </ScrollArea>
  );
});