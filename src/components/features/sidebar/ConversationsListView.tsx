import { ScrollArea } from "@/components/ui/scroll-area";
import { useConversationIds } from "@/stores/chat.store";
import { Skeleton } from "@/components/ui/skeleton";
import { ConversationItem } from "./ConversationItem";


export const ConversationListView = ({ loading }: { loading: boolean }) => {
  const conversationIds = useConversationIds();

  console.log(conversationIds);

  if (loading) {
    return (
      <div className="p-2 space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full, rounded-lg, bg-zinc-800" />
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 border-t border-zinc-800">
      <div className="p-2">
        {conversationIds.map(id => (
          <ConversationItem key={id} id={id} />
        ))}
      </div>
    </ScrollArea>
  );
};
