import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSendMessage } from "@/hooks/useChatApi";
import { PaperclipIcon, SendIcon, SmileIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface MessageInputProps {
  conversationId: string;
}

export const MessageInput = ({ conversationId }: MessageInputProps) => {
  const [content, setContent] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isSending } = useSendMessage(conversationId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSending) return;

    try {
      const tempContent = content;
      setContent("");
      await sendMessage({ content: tempContent });
      textAreaRef.current?.focus();
    } catch {
      setContent(content);
      textAreaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${Math.min(
        textAreaRef.current.scrollHeight,
        132
      )}px`;
    }
  }, [content]);

  return (
    <div className="bg-zinc-900 border-t border-zinc-800 p-4">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex items-end space-x-2"
      >
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-zinc-400 hover:text-white hover:bg-zinc-800 flex-shrink-0"
        >
          <PaperclipIcon size={18} />
        </Button>

        <div className="flex-1">
          <Textarea
            ref={textAreaRef}
            placeholder="Type a message..."
            className="min-h-[40px] max-h-[132px] bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-500 focus:border-rose-500 focus:ring-rose-500 resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
            rows={1}
          />
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-zinc-400 hover:text-white hover:bg-zinc-800 flex-shrink-0"
        >
          <SmileIcon size={18} />
        </Button>

        <Button
          type="submit"
          size="sm"
          className="bg-rose-600 hover:bg-rose-700 text-white flex-shrink-0"
          disabled={isSending}
        >
          <SendIcon size={18} />
        </Button>
      </form>
    </div>
  );
};
