import { ChatHeader } from "@/components/features/chat/ChatHeader";
import { MessageInput } from "@/components/features/chat/MessageInput";
import { MessageList } from "@/components/features/chat/MessageList";
import { useConversation } from "@/stores/chat.store";
import { useParams } from "react-router";
import {
  useConversation as useFetchConversation,
  useMarkAsRead,
} from "@/hooks/useChatApi";
import ProtectedRoute from "@/components/features/ProtectedRoute";
import { useEffect } from "react";

export default function ChatMain() {
  const { identifier } = useParams<{ identifier: string }>();

  const conversationFromStore = useConversation(identifier ?? "");
  const { conversation: fetchedConversation } = useFetchConversation(
    conversationFromStore ? null : identifier ?? null
  );
  const conversation = conversationFromStore || fetchedConversation;
  const { markAsRead } = useMarkAsRead(conversation?.id ?? null);

  useEffect(() => {
    if (conversation?.hasUnread) {
      console.log(123);
      markAsRead();
    }
  }, [conversation?.id, conversation?.hasUnread, markAsRead]);

  if (!identifier || !conversation) return null;

  return (
    <ProtectedRoute requireAuth={true} requireVerified={true}>
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatHeader conversation={conversation} />
        <MessageList conversationId={conversation.id} />
        <MessageInput conversationId={conversation.id} />
      </div>
    </ProtectedRoute>
  );
}
