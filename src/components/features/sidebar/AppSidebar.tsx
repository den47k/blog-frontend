import { useState } from "react";
import { SidebarHeader } from "./SidebarHeader";
import { ConversationListView } from "./ConversationsListView";
import { AddConversationView } from "./AddConversationView";
import { useConversations } from "@/hooks/chat/useConversations";

export const AppSidebar = () => {
  const [currentView, setCurrentView] = useState<"conversations" | "add-chat">(
    "conversations"
  );

  const { isLoading } = useConversations();

  return (
    <div className="w-96 bg-zinc-900 border-r border-zinc-700 flex flex-col overflow-hidden">
      {/* Header */}
      {currentView === "conversations" && (
        <SidebarHeader onAddChatClick={() => setCurrentView("add-chat")} />
      )}

      {/* Conversations List or Add Chat View */}
      <div className="flex-1 overflow-hidden border-t border-zinc-800">
        {currentView === "conversations" ? (
          <ConversationListView loading={isLoading} />
        ) : (
          <AddConversationView
            onBackClick={() => setCurrentView("conversations")}
          />
        )}
      </div>
    </div>
  );
};
