import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Conversation, Message } from "@/types";

export interface ChatState {
  conversations: Record<string, Conversation>;
  conversationOrder: string[];
}

export interface ChatActions {
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  // upsertConversation: (conversation: Conversation) => void;
  updateConversationOnNewMessage: (message: Message) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState & ChatActions>()(
  immer((set) => ({
    // Initial state
    conversations: {},
    conversationOrder: [],

    // Actions
    setConversations: (conversations) =>
      set(() => {
        const newConversations: Record<string, Conversation> = {};
        const sortedIds = conversations
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() -
              new Date(a.updatedAt).getTime()
          )
          .map((convo) => convo.id);

        conversations.forEach((convo) => {
          newConversations[convo.id] = convo;
        });

        return {
          conversations: newConversations,
          conversationOrder: sortedIds,
        };
      }),

    addConversation: (conversation) =>
      set((state) => {
        if (state.conversations[conversation.id]) return;

        state.conversations[conversation.id] = conversation;
        state.conversationOrder.unshift(conversation.id);
      }),

    // upsertConversation: (conversation) =>
    //   set((state) => {
    //     const exists = state.conversations[conversation.id];
    //     state.conversations[conversation.id] = conversation;

    //     if (!exists) {
    //       state.conversationOrder.unshift(conversation.id);
    //     } else {
    //       state.conversationOrder = [
    //         conversation.id,
    //         ...state.conversationOrder.filter((id) => id !== conversation.id),
    //       ];
    //     }
    //   }),

    updateConversationOnNewMessage: (message) =>
      set((state) => {
        const convoId = message.conversationId;
        const conversation = state.conversations[convoId];

        if (conversation) {
          conversation.lastMessage = message.content;
          conversation.updatedAt = message.createdAt;

          // ToDo: increment unread count

          state.conversationOrder = [
            convoId,
            ...state.conversationOrder.filter((id) => id !== convoId)
          ]
        }
      }),

    reset: () =>
      set(() => ({
        conversations: {},
        conversationOrder: [],
      })),
  }))
);

export const useConversationIds = () => 
  useChatStore(state => state.conversationOrder);

export const useConversation = (identifier: string) => 
  useChatStore((state) => {
    const byId = state.conversations[identifier];
    if (byId) return byId;

    return Object.values(state.conversations).find(
      (conversation) => conversation.userTag === identifier
    );
  });
