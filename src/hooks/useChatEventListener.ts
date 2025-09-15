import { useAuth } from "@/contexts/AuthContext";
import echo from "@/lib/echo";
import { useChatStore } from "@/stores/chat.store";
import type { Conversation, Message } from "@/types";
import { useEffect } from "react";

export const useChatEventListener = () => {
  const { user } = useAuth();
  const updateConversationOnNewMessage = useChatStore(state => state.updateConversationOnNewMessage);
  const updateConversationMessage = useChatStore(state => state.updateConversationOnMessageUpdate);
  const deleteConversationMessage = useChatStore(state => state.updateConversationOnMessageDelete);
  const addConversation = useChatStore(state => state.addConversation);
  const removeConversation = useChatStore(state => state.removeConversation);

  useEffect(() => {
    if (user) {
      const channel = echo.private(`user.${user.id}`);

      const handleMessageCreated = (event: { message: Message }) => {
        updateConversationOnNewMessage(event.message, user.id);
      };

      const handleMessageUpdated = (event: { message: Message }) => {
        updateConversationMessage(event.message);
      };

      const handleMessageDeleted = (event: {
        conversationId: string;
        deletedId: string;
        wasLastMessage: boolean;
        newLastMessage: Message | null
      }) => {
        deleteConversationMessage(
          event.conversationId,
          event.wasLastMessage,
          event.newLastMessage
        );
      };

      const handleConversationCreated = (event: { conversation: Conversation }) => {
        addConversation(event.conversation);
      }

      const handleConversationDeleted = (event: { id: string }) => {
        removeConversation(event.id);
      }

      channel.listen(".MessageCreatedEvent", handleMessageCreated);
      channel.listen(".MessageUpdatedEvent", handleMessageUpdated);
      channel.listen(".MessageDeletedEvent", handleMessageDeleted);
      channel.listen(".ConversationCreated", handleConversationCreated);
      channel.listen(".ConversationDeleted", handleConversationDeleted);

      return () => {
        channel.stopListening(".MessageCreatedEvent", handleMessageCreated);
        channel.stopListening(".MessageUpdatedEvent", handleMessageUpdated);
        channel.stopListening(".MessageDeletedEvent", handleMessageDeleted);
        channel.stopListening(".ConversationCreated", handleConversationCreated);
        channel.stopListening(".ConversationDeleted", handleConversationDeleted);
        echo.leave(`user.${user.id}`);
      };
    }
  }, [user, updateConversationOnNewMessage, updateConversationMessage,
    deleteConversationMessage, addConversation, removeConversation]);
};
