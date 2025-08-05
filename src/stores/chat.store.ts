import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Conversation, Message } from "@/types";

export interface ChatState {
  conversations: Record<string, Conversation>;
  conversationOrder: string[];
  activeConversationId: string | null;
}

export interface ChatActions {
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversationOnNewMessage: (message: Message, currentUserId?: string) => void;
  updateConversationOnMessageUpdate: (message: Message) => void;
  updateConversationOnMessageDelete: (
    conversationId: string,
    deletedMessageId: string,
    wasLastMessage: boolean,
    newLastMessage: Message | null
  ) => void;
  markConversationAsRead: (ConversationId: string) => void;
  setActiveConversation: (conversationId: string | null) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState & ChatActions>()(
  immer((set) => ({
    // Initial state
    conversations: {},
    conversationOrder: [],
    activeConversationId: null,

    // Actions
    setConversations: (conversations) =>
      set(() => {
        const newConversations: Record<string, Conversation> = {};
        const sortedIds = conversations
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
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

    updateConversationOnNewMessage: (message, currentUserId) =>
      set((state) => {
        const convoId = message.conversationId;
        const conversation = state.conversations[convoId];
        if (!conversation) return;

        if (!conversation.lastMessage) {
          conversation.lastMessage = message;
        } else {
          conversation.lastMessage.content = message.content;
          conversation.lastMessage.createdAt = message.createdAt;
        }

        const isCurrentUserMessage = message.senderId === currentUserId;
        const isActiveConversation = state.activeConversationId === convoId;

        conversation.hasUnread = !isCurrentUserMessage && !isActiveConversation;

        state.conversationOrder = [
          convoId,
          ...state.conversationOrder.filter((id) => id !== convoId),
        ];
      }),

    updateConversationOnMessageUpdate: (message) =>
      set((state) => {
        const convo = state.conversations[message.conversationId];
        if (!convo || !convo.lastMessage) return;

        if (convo.lastMessage.id === message.id) {
          convo.lastMessage.content = message.content;
        }
      }),

    updateConversationOnMessageDelete: (conversationId, deletedMessageId, wasLastMessage, newLastMessage) =>
      set((state) => {
        const convo = state.conversations[conversationId];
        if (!convo) return;

        if (wasLastMessage) {
          if (newLastMessage) {
            convo.lastMessage = newLastMessage;
          } else {
            convo.lastMessage = null;
          }

          state.conversationOrder = [
            conversationId,
            ...state.conversationOrder.filter(id => id !== conversationId),
          ];
        }
      }),

    markConversationAsRead: (conversationId: string) =>
      set((state) => {
        const conversation = state.conversations[conversationId];
        if (conversation) {
          conversation.hasUnread = false;
        }
      }),

    setActiveConversation: (conversationId) =>
      set((state) => {
        state.activeConversationId = conversationId;
        // Mark as read when opened
        if (conversationId && state.conversations[conversationId]) {
          state.conversations[conversationId].hasUnread = false;
        }
      }),

    reset: () =>
      set(() => ({
        conversations: {},
        conversationOrder: [],
      })),
  }))
);

export const useConversations = () =>
  useChatStore((state) => state.conversations);

export const useConversationIds = () =>
  useChatStore((state) => state.conversationOrder);

export const useConversation = (identifier: string) =>
  useChatStore((state) => {
    const byId = state.conversations[identifier];
    if (byId) return byId;

    return Object.values(state.conversations).find(
      (conversation) => conversation.userTag === identifier
    );
  });
