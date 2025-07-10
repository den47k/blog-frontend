import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import useSWRMutation from "swr/mutation";
import api from "@/lib/api";
import { useChatStore } from "@/stores/chat.store";
import type { Conversation, Message, PaginatedMessages } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useCallback } from "react";

const swrConfig = {
  revalidateOnFocus: false,
  dedupingInterval: 60_000,
  errorRetryCount: 2,
};

// --- Helpers ---
const getMessagesKey = (
  pageIndex: number,
  previousPageData: PaginatedMessages | null,
  conversationId: string
) => {
  if (previousPageData && !previousPageData.links.next) {
    return null;
  }

  if (pageIndex === 0) {
    return `/conversations/${conversationId}/messages`;
  }

  if (previousPageData?.links.next) {
    const url = new URL(previousPageData.links.next);
    return `/conversations/${conversationId}/messages?page=${url.searchParams.get(
      "page"
    )}`;
  }

  return null;
};

// --- QUERIES ---
export const useConversation = (id: string | null) => {
  const { data, error, isLoading } = useSWR<Conversation>(
    id ? `/conversations/private/${id}` : null,
    (url: string) => api.get(url).then((res) => res.data.data),
    {
      ...swrConfig
    }
  );

  return {
    conversation: data,
    error,
    isLoading
  }
}

export const useConversations = () => {
  const { user } = useAuth();
  const { setConversations } = useChatStore();

  const { data, error, isLoading, isValidating } = useSWR<Conversation[]>(
    user ? ["/conversations", user.id] : null,
    ([url]) => api.get(url).then((res) => res.data.data),
    {
      ...swrConfig,
      onSuccess: (data) => data && setConversations(data),
      revalidateOnMount: true,
      revalidateIfStale: true,
    }
  );

  return {
    data,
    error,
    isLoading,
    isValidating,
  };
};

export const useMessages = (conversationId: string | null) => {
  const { user } = useAuth();

  const { data, error, isLoading, size, setSize, mutate } = useSWRInfinite<PaginatedMessages>(
      (pageIndex, previousPageData) =>
        user && conversationId
          ? getMessagesKey(pageIndex, previousPageData, conversationId)
          : null,
      (url: string) => api.get(url).then((res) => res.data),
      {
        revalidateFirstPage: false,
        revalidateAll: false,
        revalidateOnFocus: false
      }
    );

  const messages: Message[] = data ? data.flatMap((page) => page.data) : [];

  const hasMore = data ? !!data[data.length - 1]?.links.next : false;
  const isInitialLoading = isLoading && messages.length === 0;

  const loadMore = () => {
    if (hasMore && !isLoading) {
      setSize(size + 1);
    }
  };

  return {
    messages,
    error,
    isLoading: isInitialLoading,
    hasMore,
    loadMore,
    mutateMessages: mutate,
  };
};

// --- MUTATIONS ---

// fetchers
 const sendMessageFetcher = async (
  url: string,
  { arg }: { arg: { content: string } }
): Promise<{ message: Message, conversation: Conversation }> => {
  return api.post(url, { content: arg.content }).then((res) => res.data.data);
};

// hooks
export const useSendMessage = (conversationId: string | null) => {
  const { user } = useAuth();
  const { mutateMessages } = useMessages(conversationId);
  const updateConversationOnNewMessage = useChatStore(
    (state) => state.updateConversationOnNewMessage
  );

  const { trigger, isMutating } = useSWRMutation(
    conversationId ? `/conversations/${conversationId}/messages` : null,
    sendMessageFetcher,
    {
      onSuccess: (data: { message: Message, conversation: Conversation }) => {
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
          { revalidate: false }
        );
      },
      revalidate: false,
      throwOnError: false,
    }
  );

  const sendMessage = useCallback(async (arg: { content: string }) => {
    if (!conversationId || !user) return;
    await trigger(arg);
  }, [conversationId, user, trigger]);

  return {
    sendMessage,
    isSending: isMutating,
  };
};
