import { useAuth } from "@/contexts/AuthContext";
import echo from "@/lib/echo";
import { useChatStore } from "@/stores/chat.store";
// import type { Message } from "@/types";
import { useEffect } from "react";

export const useEchoNotifications = () => {
  const { user } = useAuth();
	const updateConversationOnNewMessage = useChatStore(state => state.updateConversationOnNewMessage);

  useEffect(() => {
    if (user) {
      const channel = echo.private(`user.${user.id}`);

      channel.listen(".NewMessageReceived", (e: any) => {
				updateConversationOnNewMessage(e.message, user.id);
			});

      return () => {
        channel.unsubscribe();
        channel.stopListening(".NewMessageReceived");
      };
    }
  }, [user, updateConversationOnNewMessage]);
};
