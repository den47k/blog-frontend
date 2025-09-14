import { useAuth } from "@/contexts/AuthContext";
import echo from "@/lib/echo";
import { useChatStore } from "@/stores/chat.store";
import type { Message } from "@/types";
import { useEffect } from "react";

export const useMessageEventListener = () => {
  const { user } = useAuth();
  const updateConversationOnNewMessage = useChatStore(state => state.updateConversationOnNewMessage);
  const updateConversationMessage = useChatStore(state => state.updateConversationOnMessageUpdate);
  const deleteConversationMessage = useChatStore(state => state.updateConversationOnMessageDelete);

  // useEffect(() => {
  //   if (user) {
  //     const channel = echo.private(`user.${user.id}`);

  //     const handleMessageEvent = (event: MessageEventData) => {
  //       switch (event.operation) {
  //         case 'create':
  //           updateConversationOnNewMessage(event.message, user.id);
  //           break;

  //         case 'update':
  //           updateConversationMessage(event.message);
  //           break;

  //         case 'delete':
  //           deleteConversationMessage(
  //             event.conversationId,
  //             // event.deletedId,
  //             event.wasLastMessage,
  //             event.newLastMessage
  //           );
  //           break;
  //       }
  //       if (event.operation === 'create') {

  //       }
  //     }

  //     channel.listen(".MessageEvent", handleMessageEvent);

  //     return () => {
  //       channel.stopListening(".MessageEvent");
  //       echo.leave(`user.${user.id}`);
  //     };
  //   }
  // }, [user, updateConversationOnNewMessage]);

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

    channel.listen(".MessageCreatedEvent", handleMessageCreated);
    channel.listen(".MessageUpdatedEvent", handleMessageUpdated);
    channel.listen(".MessageDeletedEvent", handleMessageDeleted);

    return () => {
      channel.stopListening(".MessageCreatedEvent", handleMessageCreated);
      channel.stopListening(".MessageUpdatedEvent", handleMessageUpdated);
      channel.stopListening(".MessageDeletedEvent", handleMessageDeleted);
      echo.leave(`user.${user.id}`);
    };
  }
}, [user, updateConversationOnNewMessage]);
};
