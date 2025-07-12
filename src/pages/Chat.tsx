import { ChatHeader } from "@/components/features/chat/ChatHeader";
import { MessageInput } from "@/components/features/chat/MessageInput";
import { MessageList } from "@/components/features/chat/MessageList";
import { useConversation } from "@/stores/chat.store";
import { useParams } from "react-router";
import { useConversation as useFetchConversation } from "@/hooks/useChatApi";
import ProtectedRoute from "@/components/features/ProtectedRoute";

export default function ChatMain() {
  const { identifier } = useParams<{ identifier: string }>();
  if (!identifier) return null;

  const conversationFromStore = useConversation(identifier);
  const { conversation: fetchedConversation } = useFetchConversation(
    conversationFromStore ? null : identifier
  );

  const conversation = conversationFromStore || fetchedConversation;
  if (!conversation) return null;

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
