import useSWR, { useSWRConfig }from "swr";
import useSWRMutation from "swr/mutation";
import api from "@/lib/api";
import { useChatStore } from "@/stores/chat.store";
import type { Conversation } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

const swrConfig = {
  revalidateOnFocus: false,
  dedupingInterval: 60_000,
  errorRetryCount: 2,
};

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

// --- MUTATIONS ---

const createPrivateConversationFetcher = async (
  url: string, 
  { arg }: { arg: { userId: number } }
): Promise<Conversation> => {
  return api.post(url, { user_id: arg.userId })
    .then(res => res.data.conversation);
};

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
