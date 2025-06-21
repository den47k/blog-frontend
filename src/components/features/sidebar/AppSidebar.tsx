import { useEffect, useState } from "react";
import { SidebarHeader } from "./SidebarHeader";
import { ConversationListView } from "./ConversationsListView";
import { AddConversationView } from "./AddConversationView";
import useApi from "@/hooks/useApi";

export const AppSidebar = () => {
  const [currentView, setCurrentView] = useState<"conversations" | "add-chat">(
    "conversations"
  );
  const { get } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await get("/conversations");
        console.log(data);
      } catch (err) {
        console.error("Failed to load messages", err);
        console.log("Failed to load messages");
      }
    };

    fetchData();
  }, []);

  const conversations = [
    {
      id: 1,
      name: "Sarah Johnson",
      lastMessage: "Hey! How's your day going?",
      timestamp: "2m",
      unread: 2,
      avatar: "/placeholder.svg?height=40&width=40",
      online: true,
    },
    {
      id: 2,
      name: "Dev Team",
      lastMessage: "Alice: The new feature is ready for testing",
      timestamp: "15m",
      unread: 0,
      avatar: "/placeholder.svg?height=40&width=40",
      online: false,
      isGroup: true,
    },
    {
      id: 3,
      name: "Mike Chen",
      lastMessage: "Thanks for the help earlier!",
      timestamp: "1h",
      unread: 0,
      avatar: "/placeholder.svg?height=40&width=40",
      online: true,
    },
    {
      id: 4,
      name: "Emma Wilson",
      lastMessage: "Can we schedule a call tomorrow?",
      timestamp: "2h",
      unread: 1,
      avatar: "/placeholder.svg?height=40&width=40",
      online: false,
    },
    {
      id: 5,
      name: "Project Alpha",
      lastMessage: "John: Meeting notes uploaded",
      timestamp: "3h",
      unread: 0,
      avatar: "/placeholder.svg?height=40&width=40",
      online: false,
      isGroup: true,
    },
    {
      id: 6,
      name: "Lisa Park",
      lastMessage: "See you at the conference!",
      timestamp: "1d",
      unread: 0,
      avatar: "/placeholder.svg?height=40&width=40",
      online: false,
    },
  ];

  return (
    <div className="w-96 bg-zinc-900 border-r border-zinc-700 flex flex-col">
      {/* Header */}
      {currentView === "conversations" && (
        <SidebarHeader onAddChatClick={() => setCurrentView("add-chat")} />
      )}

      {/* Conversations List or Add Chat View */}
      {currentView === "conversations" ? (
        <ConversationListView conversations={conversations} />
      ) : (
        <AddConversationView
          onBackClick={() => setCurrentView("conversations")}
        />
      )}
    </div>
  );
};
