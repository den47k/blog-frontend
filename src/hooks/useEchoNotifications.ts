import { useAuth } from "@/contexts/AuthContext";
import echo from "@/lib/echo";
import { useChatStore } from "@/stores/chat.store";
import type { Message } from "@/types";
import { useEffect } from "react";

export const useEchoNotifications = () => {
  const { user } = useAuth();
	const updateConversationOnNewMessage = useChatStore(state => state.updateConversationOnNewMessage);

  useEffect(() => {
    if (user) {
      const channel = echo.private(`App.Models.User.${user.id}`);

      channel.notification((newMessage: Message) => {
				console.log(newMessage);
				updateConversationOnNewMessage(newMessage, user.id);
			});

      return () => {
        channel.unsubscribe();
      };
    }
  }, [user, updateConversationOnNewMessage]);
};
