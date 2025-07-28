import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageItem } from "./MessageItem";
import { memo, useCallback, useRef, useLayoutEffect, useEffect } from "react";
import { useMessages } from "@/hooks/useChatApi";
import { useChatStore } from "@/stores/chat.store";
import echo from "@/lib/echo";
import type { Message, PaginatedMessages } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

interface MessageListProps {
  conversationId: string | null;
}

export const MessageList = memo(({ conversationId }: MessageListProps) => {
  const { user } = useAuth();
  const { messages, isLoading, error, hasMore, loadMore, mutateMessages } = useMessages(conversationId);

  const updateConversationOnNewMessage = useChatStore(state => state.updateConversationOnNewMessage);
  const setActiveConversation = useChatStore(state => state.setActiveConversation);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const oldScrollHeightRef = useRef(0);

  const lastMessageCountRef = useRef(0);
  const isInitialLoadRef = useRef(true);
  const isPrependingRef = useRef(false);
  const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = useCallback((smooth = false) => {
    const viewport = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLElement;

    if (viewport) {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    }
  }, []);

  useEffect(() => {
    if (conversationId) {
      setActiveConversation(conversationId);
    }
    
    return () => {
      setActiveConversation(null);
    };
  }, [conversationId, setActiveConversation]);

  useEffect(() => {
    if (!conversationId || !user) return;

    const channel = echo.private(`conversation.${conversationId}`);

    const handleNewMessage = (newMessage: Message) => {
      updateConversationOnNewMessage(newMessage, user.id);

      if (newMessage.conversationId === conversationId) {
        mutateMessages((currentPages: PaginatedMessages[] | undefined) => {
          if (!currentPages || currentPages.length === 0) {
            const newPage: PaginatedMessages = {
              data: [newMessage],
              links: { first: null, last: null, prev: null, next: null },
              meta: { current_page: 1, last_page: 1, per_page: 30, total: 1 },
            };
            return [newPage];
          }

          if (currentPages[0].data.some(m => m.id === newMessage.id)) {
            return currentPages;
          }

          const updatedPages = [...currentPages];
          updatedPages[0] = {
            ...updatedPages[0],
            data: [newMessage, ...updatedPages[0].data],
          };

          return updatedPages;
        }, false);
      }
    };

    channel.listen('.MessageSent', handleNewMessage)

    return () => {
      channel.stopListening(".MessageSent");
      echo.leave(`conversation.${conversationId}`);
    }
  }, [conversationId, mutateMessages, updateConversationOnNewMessage]);

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLElement | null;
    
    if (!viewport) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          // Clear any pending throttle timeouts
          if (throttleTimeoutRef.current) {
            clearTimeout(throttleTimeoutRef.current);
            throttleTimeoutRef.current = null;
          }

          // Set throttle timeout to prevent rapid requests
          throttleTimeoutRef.current = setTimeout(() => {
            const viewport = scrollAreaRef.current?.querySelector(
              "[data-radix-scroll-area-viewport]"
            ) as HTMLElement;

            if (viewport) {
              oldScrollHeightRef.current = viewport.scrollHeight;
              isPrependingRef.current = true;
              loadMore();
            }
          }, 300);
        }
      },
      {
        root: viewport,
        rootMargin: "300px 0px 0px 0px",
        threshold: 0.1 
      }
    );

    if (topSentinelRef.current) {
      observer.observe(topSentinelRef.current);
    }

    return () => {
      observer.disconnect();
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current);
      }
    };
  }, [hasMore, isLoading, loadMore]);

  useLayoutEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLElement;

    if (!viewport) return;

    if (isPrependingRef.current) {
      const newScrollHeight = viewport.scrollHeight;
      viewport.scrollTop = newScrollHeight - oldScrollHeightRef.current;
      isPrependingRef.current = false;
    } else if (isInitialLoadRef.current) {
      scrollToBottom(false);
      isInitialLoadRef.current = false;
    } else if (messages.length > lastMessageCountRef.current) {
      scrollToBottom(true);
    }

    lastMessageCountRef.current = messages.length;
  }, [messages.length, conversationId, scrollToBottom]);

  useEffect(() => {
    isInitialLoadRef.current = true;
    isPrependingRef.current = false;
  }, [conversationId]);

  if (isLoading)
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>Loading messages...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>Failed to load messages.</p>
      </div>
    );

  return (
    <ScrollArea className="flex-1 min-h-0 bg-zinc-950" ref={scrollAreaRef}>
      <div className="p-4 space-y-4">
        {hasMore && <div ref={topSentinelRef} className="h-1" />}

        {messages
          .slice()
          .reverse()
          .map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
      </div>
    </ScrollArea>
  );
});
