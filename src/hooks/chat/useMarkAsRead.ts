import api from "@/lib/api";
import { useChatStore } from "@/stores/chat.store";
import useSWRMutation from "swr/mutation";

export const useMarkAsRead = (conversationId: string | null) => {
  const { trigger, isMutating } = useSWRMutation(
    conversationId ? `/conversations/${conversationId}/mark-as-read` : null,
    (url: string) => api.post(url),
    {
      onSuccess: () => {
        if (conversationId) {
          useChatStore.getState().markConversationAsRead(conversationId);
        }
      },
      revalidate: false,
    }
  );

  return {
    markAsRead: trigger,
    isMarking: isMutating,
  };
};