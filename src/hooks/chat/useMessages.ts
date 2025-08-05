import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import type { Message, PaginatedMessages } from "@/types";
import useSWRInfinite from "swr/infinite";

const getMessagesKey = (
  pageIndex: number,
  previousPageData: PaginatedMessages | null,
  conversationId: string,
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
      "page",
    )}`;
  }

  return null;
};

export const useMessages = (conversationId: string | null) => {
  const { user } = useAuth();

  const { data, error, isLoading, size, setSize, mutate } =
    useSWRInfinite<PaginatedMessages>(
      (pageIndex, previousPageData) =>
        user && conversationId
          ? getMessagesKey(pageIndex, previousPageData, conversationId)
          : null,
      (url: string) => api.get(url).then((res) => res.data),
      {
        revalidateFirstPage: false,
        revalidateAll: false,
        revalidateOnFocus: false,
      },
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