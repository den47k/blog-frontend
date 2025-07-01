import useSWR, { useSWRConfig }from "swr";
import useSWRMutation from "swr/mutation";
import api from "@/lib/api";
import { useChatStore } from "@/stores/chat.store";
import type { Conversation, Message } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useCallback } from "react";

const swrConfig = {
  revalidateOnFocus: false,
  dedupingInterval: 60_000,
  errorRetryCount: 2,
};

interface PaginatedMessages {
  data: Message[];
  // optionally: meta, links, etc.
}

// --- QUERIES ---
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

  const { data, error, isLoading } = useSWR<PaginatedMessages>(
    (user && conversationId) ? `/conversations/${conversationId}/messages` : null,
    (url) => api.get(url).then((res) => res.data),
    {
      ...swrConfig,
      revalidateOnMount: true
    }
  );

  return {
    messages: data?.data ?? [],
    error,
    isLoading
  }
}

// --- MUTATIONS ---

// fetchers
const createPrivateConversationFetcher = async (
  url: string, 
  { arg }: { arg: { userId: number } }
): Promise<Conversation> => {
  return api.post(url, { user_id: arg.userId })
    .then(res => res.data.conversation);
};

const sendMessageFetcher = async (
  url: string,
  { arg }: { arg: { content: string } }
): Promise<Message> => {
  return api.post(url, { content: arg.content }).then(res => res.data.data);
};

// hooks
export const useCreatePrivateConversation = () => {
  const { mutate } = useSWRConfig();
	const { addConversation } = useChatStore();

	const { trigger, isMutating } = useSWRMutation(
		"/conversations/private",
		createPrivateConversationFetcher,
		{
			...swrConfig,
      onSuccess: (newConvo) => {
        addConversation(newConvo);
        mutate("/conversations", (conversations: Conversation[] = []) => 
          [newConvo, ...conversations], false
        );
      },
      throwOnError: false,	
		}
	);

	return {
		createConversation: trigger,
    isCreating: isMutating,
	}
}

export const useSendMessage = (conversationId: string | null) => {
  const { user } = useAuth();
  const { mutate } = useSWRConfig();
  const messagesKey = conversationId ? `/conversations/${conversationId}/messages` : null;
  const updateConversationOnNewMessage = useChatStore(
    state => state.updateConversationOnNewMessage
  );

  const { trigger, isMutating } = useSWRMutation(
    messagesKey,
    sendMessageFetcher,
    {
      onSuccess: (newMessage) => {
        updateConversationOnNewMessage(newMessage);
        
        mutate(messagesKey, (current: PaginatedMessages | undefined) => {
          if (!current) return { data: [newMessage] };

          return {
            ...current,
            data: [newMessage, ...current.data],
          };
        }, false);
      },
      revalidate: false,
      throwOnError: false,
    }
  );

  const sendMessage = useCallback(async (arg: { content: string }) => {
    if (!messagesKey || !user || !conversationId) return;
    await trigger(arg);
  }, [conversationId, messagesKey, user, trigger]);

  return {
    sendMessage,
    isSending: isMutating,
  };
};
