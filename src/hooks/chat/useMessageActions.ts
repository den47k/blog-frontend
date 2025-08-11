import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import type { Conversation, Message, PaginatedMessages } from "@/types";
import { useMessages } from "./useMessages";
import { useChatStore } from "@/stores/chat.store";
import useSWRMutation from "swr/mutation";
import { useCallback } from "react";

// fetchers
const sendMessageFetcher = async (
  url: string,
  { arg }: { arg: { content?: string; attachment?: File } },
): Promise<{ message: Message; conversation: Conversation }> => {
  const formData = new FormData();

  if (arg.content) formData.append('content', arg.content);
  if (arg.attachment) formData.append('attachment', arg.attachment);

  return api.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res) => res.data.data);
};

const updateMessageFetcher = async (
  url: string,
  { arg }: { arg: { messageId: string; content: string } }
) => {
  return api.patch(`${url}/${arg.messageId}`, { content: arg.content }).then(res => res.data.data);
};

const deleteMessageFetcher = async (
  url: string,
  { arg }: { arg: { messageId: string } }
) => {
  return api.delete(`${url}/${arg.messageId}`).then(res => res.data);
};

// hooks
export const useSendMessage = (conversationId: string | null) => {
  const { user } = useAuth();
  const { mutateMessages } = useMessages(conversationId);
  const updateConversationOnNewMessage = useChatStore(
    (state) => state.updateConversationOnNewMessage,
  );

  const { trigger, isMutating } = useSWRMutation(
    conversationId ? `/conversations/${conversationId}/messages` : null,
    sendMessageFetcher,
    {
      onSuccess: (data: { message: Message; conversation: Conversation }) => {
        const { message, conversation } = data;

        const exists = useChatStore.getState().conversations[conversation.id];
        if (!exists) useChatStore.getState().addConversation(conversation);

        updateConversationOnNewMessage(message);

        mutateMessages(
          (currentPages: PaginatedMessages[] | undefined) => {
            if (!currentPages || currentPages.length === 0) {
              const newPage: PaginatedMessages = {
                data: [message],
                links: { first: null, last: null, prev: null, next: null },
                meta: { current_page: 1, last_page: 1, per_page: 30, total: 1 },
              };
              return [newPage];
            }

            const newPages = JSON.parse(JSON.stringify(currentPages));

            newPages[0].data.unshift(message);

            return newPages;
          },
          { revalidate: false },
        );
      },
      revalidate: false,
      throwOnError: false,
    },
  );

  const sendMessage = useCallback(
    async (arg: { content?: string; attachment?: File }) => {
      if (!conversationId || !user) return;
      await trigger(arg);
    },
    [conversationId, user, trigger],
  );

  return {
    sendMessage,
    isSending: isMutating,
  };
};

export const useUpdateMessage = (conversationId: string | null) => {
  const { mutateMessages } = useMessages(conversationId);
  const updateConversationMessage = useChatStore(state => state.updateConversationOnMessageUpdate);

  const { trigger, isMutating } = useSWRMutation(
    conversationId ? `/conversations/${conversationId}/messages` : null,
    updateMessageFetcher,
    {
      onSuccess: (updatedMessage) => {
        if (updatedMessage) {
          updateConversationMessage(updatedMessage);
        }

        mutateMessages((currentPages: PaginatedMessages[] | undefined) => {
          if (!currentPages) return currentPages;
          return currentPages.map(page => ({
            ...page,
            data: page.data.map(m =>
              m.id === updatedMessage.id ? { ...m, ...updatedMessage } : m
            ),
          }));
        }, false);
      },
      revalidate: false,
    }
  );

  return {
    updateMessage: trigger,
    isUpdating: isMutating,
  };
};

export const useDeleteMessage = (conversationId: string | null) => {
  const { mutateMessages } = useMessages(conversationId);
  const deleteConversationMessage = useChatStore(state => state.updateConversationOnMessageDelete);

  const { trigger, isMutating } = useSWRMutation(
    conversationId ? `/conversations/${conversationId}/messages` : null,
    deleteMessageFetcher,
    {
      onSuccess: (data) => {
        if (conversationId) {
          deleteConversationMessage(
            conversationId,
            data.deletedId,
            data.wasLastMessage,
            data.newLastMessage
          );
        }

        mutateMessages((currentPages: PaginatedMessages[] | undefined) => {
          if (!currentPages) return currentPages;

          return currentPages.map(page => ({
            ...page,
            data: page.data.filter(m => m.id !== data.deletedId),
          }));
        }, false);
      },
      revalidate: false,
    }
  );

  return {
    deleteMessage: trigger,
    isDeleting: isMutating,
  };
};
