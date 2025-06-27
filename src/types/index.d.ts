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
  title: string;
  description?: string;
  lastMessage: string;
  timestamp: string;
  unread: number; // make 0 by default
  avatar: string;
  online: boolean | null; // make null by default
  isGroup?: boolean;
  createdAt: string;
  updatedAt: string;
};
