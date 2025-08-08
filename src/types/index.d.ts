// data
export type User = {
  id: string;
  name: string;
  tag: string;
  email: string;
  avatar: {
    original: string;
    medium: string;
    small: string;
  } | null;
  isEmailVerified: boolean | null;
};

export type Conversation = {
  id: string;
  userTag: string | null;
  title: string;
  description?: string;
  // lastMessage: string;
  // lastMessageTimestamp: string;
  lastMessage: Message | null;
  hasUnread: boolean;
  avatar: string;
  type: string;
  participants: User[];
  lastSeenAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Message = {
  id: string;
  content: string;
  senderId: string;
  conversationId: string;
  editedAt: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    tag: string;
    avatar: string;
  };
};

export interface Paginated<T> {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export type PaginatedMessages = Paginated<Message>;

// events
export interface MessageEventData {
  operation: 'create' | 'update' | 'delete';
  message: Message;
  deletedId: string;
  conversationId: string;
  wasLastMessage: boolean;
  newLastMessage: Message;
}
