export type User = {
  id: string;
  name: string;
  tag: string;
  email: string;
  avatar: string;
  isEmailVerified: boolean | null;
};

export type Conversation = {
  id: string;
  userTag: string | null;
  title: string;
  description?: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  unread: number; // make 0 by default
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
  status: "sent" | "read";
  createdAt: string;
  sender: {
    id: string;
    name: string;
    tag: string;
    avatar: string;
  }
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
};

export type PaginatedMessages = Paginated<Message>;
