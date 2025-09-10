import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { useChatStore } from "@/stores/chat.store";
import type { Conversation } from "@/types";
import useSWR from "swr";
import useApi from "../useApi";
import { useNavigate } from "react-router";

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

export const useCreatePrivateConversation = () => {
  const { post } = useApi();
  // const { addConversation } = useChatStore();

  const createPrivateConversation = async (userId: string, shouldJoinNow: boolean = false) => {
    try {
      await post("/conversations/private", {
        user_id: userId,
        should_join_now: shouldJoinNow,
      });

      // if (shouldJoinNow) addConversation(Response.data.data);

      return { success: true };
    } catch (error: any) {
      console.error("Failed to create conversation:", error);

      return { success: false, error };
    }
  }

  return { createPrivateConversation };
}

export const useDeleteConversation = () => {
  const { delete: del } = useApi();
  const { removeConversation } = useChatStore();
  const navigate = useNavigate();

  const deleteConversation = async (conversationId: string) => {
    try {
      await del(`/conversations/${conversationId}`);
      removeConversation(conversationId);
      navigate("/");

      return { success: true };
    } catch (error: any) {
      console.error("Failed to delete conversation:", error);

      return { success: false, error };
    }
  }

  return { deleteConversation };
}
