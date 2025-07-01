import { ChatHeader } from "@/components/features/chat/ChatHeader";
import { MessageInput } from "@/components/features/chat/MessageInput";
import { MessageList } from "@/components/features/chat/MessageList";
import { useConversation } from "@/stores/chat.store";
import { useParams } from "react-router";

export default function ChatMain() {
  const { userTag } = useParams<{ userTag: string }>();
  const conversation = userTag ? useConversation(userTag) : undefined;
  const conversationId = conversation?.id;

  if (!conversationId) return null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ChatHeader conversation={conversation} />
      <MessageList conversationId={conversation.id} />
      <MessageInput conversationId={conversationId} />
    </div>
  );
}
