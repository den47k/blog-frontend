import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { useChatStore } from "@/stores/chat.store";
import type { Conversation } from "@/types";
import useSWR from "swr";

const swrConfig = {
  revalidateOnFocus: false,
  dedupingInterval: 60_000,
  errorRetryCount: 2,
};


export const useConversation = (id: string | null) => {
  const { data, error, isLoading } = useSWR<Conversation>(
    id ? `/conversations/private/${id}` : null,
    (url: string) => api.get(url).then((res) => res.data.data),
    {
      ...swrConfig,
    },
  );

  return {
    conversation: data,
    error,
    isLoading,
  };
};

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
    },
  );

  return {
    data,
    error,
    isLoading,
    isValidating,
  };
};