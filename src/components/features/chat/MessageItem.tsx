import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useAuth } from "@/contexts/AuthContext";
import { formatTimestamp } from "@/lib/utils";
import type { Message } from "@/types";
import { Copy, Edit3, Reply, Trash2 } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";

// ToDo implement onEdit and OnDelete
interface MessageItemProps {
  message: Message;
  isEditing?: boolean;
  onEdit?: (message: Message) => void;
  onSaveEdit?: (messageId: string, content: string) => void;
  onCancelEdit?: () => void;
  onDelete?: (message: Message) => void;
  onReply?: (message: Message) => void;
}

export const MessageItem = memo(
  ({ message, isEditing = false, onEdit, onSaveEdit, onCancelEdit, onDelete, onReply }: MessageItemProps) => {
    const { user } = useAuth();
    const isOwn = message.senderId === user?.id;
    const hasContent = !!message.content;
    const hasAttachment = !!message.attachment;

    const [editContent, setEditContent] = useState(message.content);
    const editRef = useRef<HTMLTextAreaElement>(null);

    const handleCopyMessage = () => {
      navigator.clipboard.writeText(message.content);
    };

    useEffect(() => {
      if (isEditing && editRef.current) {
        editRef.current.focus();
        editRef.current.select();
      }
    }, [isEditing]);

    const messageBubbleContent = (
      <div
        className={`max-w-xs lg:max-w-md min-w-[100px] rounded-2xl transition-all duration-200 cursor-pointer ${isOwn
          ? "bg-rose-600 text-white rounded-br-none hover:bg-rose-700"
          : "bg-zinc-800 text-zinc-200 rounded-bl-none hover:bg-zinc-700"
          }`}
      >

        {hasAttachment && (
          <div className="relative">
            <img
              src={message.attachment!.urls.original || "/placeholder.svg"}
              alt="Message attachment"
              className="w-full max-h-60 object-cover"
            />
            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            <div className={`flex px-4 py-2`}>
              <span
                className={`flex-shrink-0 text-xs ${isOwn ? "text-rose-200 ml-auto" : "text-zinc-500"}`}
                style={{ minWidth: "fit-content" }}
              >
                {formatTimestamp(message.createdAt)}
              </span>
            </div>
          </div>
        )}

        {(hasContent || !hasAttachment) && ( // Always show timestamp area
          <div className="flex justify-between items-end gap-3 px-4 py-2">
            {hasContent && (
              <p className="text-sm whitespace-pre-wrap break-words">
                {message.content}
              </p>
            )}
            <span
              className={`flex-shrink-0 text-xs ${isOwn ? "text-rose-200" : "text-zinc-500"
                }`}
              style={{ minWidth: "fit-content" }}
            >
              {formatTimestamp(message.createdAt)}
            </span>
          </div>
        )}
      </div>
    );

    if (isEditing) {
      return (
        <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
          <div className="bg-zinc-800 rounded-2xl p-3 w-full max-w-md">
            <textarea
              ref={editRef}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-transparent text-white resize-none focus:outline-none"
              rows={Math.min(editContent.split('\n').length, 6)}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={onCancelEdit}
                className="px-3 py-1 text-sm text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => onSaveEdit?.(message.id, editContent)}
                className="px-3 py-1 text-sm bg-rose-600 text-white rounded hover:bg-rose-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`flex ${isOwn ? "justify-end" : "justify-start"} space-x-2`}
        data-message-id={message.id}
      >
        <ContextMenu>
          <ContextMenuTrigger asChild>
            {messageBubbleContent}
          </ContextMenuTrigger>
          <ContextMenuContent
            className={
              "w-48 border-0 shadow-xl bg-zinc-900/95 backdrop-blur-sm"
            }
          >
            {/* Copy option - available for all messages */}
            <ContextMenuItem
              onClick={handleCopyMessage}
              className="flex items-center gap-2 px-3 py-2 text-sm transition-colors text-zinc-200 hover:bg-zinc-800/70 hover:text-white focus:bg-zinc-800/70 focus:text-white cursor-pointer"
            >
              <Copy className="w-4 h-4" />
              Copy message
            </ContextMenuItem>

            {/* Reply option - available for all messages */}
            {onReply && (
              <ContextMenuItem
                onClick={() => onReply(message)}
                className="flex items-center gap-2 px-3 py-2 text-sm transition-colors text-zinc-200 hover:bg-zinc-800/70 hover:text-white focus:bg-zinc-800/70 focus:text-white cursor-pointer"
              >
                <Reply className="w-4 h-4" />
                Reply
              </ContextMenuItem>
            )}

            {/* Separator before own message actions */}
            {isOwn && (onEdit || onDelete) && (
              <ContextMenuSeparator className={"bg-zinc-700/50"} />
            )}

            {/* Edit option - only for own messages */}
            {isOwn && onEdit && (
              <ContextMenuItem
                onClick={() => onEdit(message)}
                className="flex items-center gap-2 px-3 py-2 text-sm transition-colors text-zinc-200 hover:bg-zinc-800/70 hover:text-white focus:bg-zinc-800/70 focus:text-white cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                Edit message
              </ContextMenuItem>
            )}

            {/* Delete option - only for own messages */}
            {isOwn && onDelete && (
              <ContextMenuItem
                onClick={() => onDelete(message)}
                className="flex items-center gap-2 px-3 py-2 text-sm transition-colors text-red-400 hover:bg-zinc-800/70 hover:text-red-300 focus:bg-zinc-800/70 focus:text-red-400 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Delete message
              </ContextMenuItem>
            )}
          </ContextMenuContent>
        </ContextMenu>
      </div>
    );
  }
);
