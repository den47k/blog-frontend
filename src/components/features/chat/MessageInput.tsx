import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSendMessage } from "@/hooks/chat/useMessageActions";
import { PaperclipIcon, SendIcon, SmileIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";


export const MessageInput = ({ conversationId }: { conversationId: string; }) => {
  const [content, setContent] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isSending } = useSendMessage(conversationId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!content.trim() && !attachment) || isSending) return;

    try {
      const tempContent = content;
      const tempAttachment = attachment;

      setContent("");
      setAttachment(null);
      setAttachmentPreview(null);

      await sendMessage({
        content: tempContent,
        attachment: tempAttachment ?? undefined,
      });

      textAreaRef.current?.focus();
    } catch {
      setContent(content);
      setAttachment(attachment);
      textAreaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      alert("File size exceeds 25MB limit");
      return;
    }

    setAttachment(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setAttachmentPreview(reader.result as string);
      reader.readAsDataURL(file);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = () => {
    setAttachment(null);
    setAttachmentPreview(null);
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
      {attachment && (
        <div className="relative mb-2 flex items-center justify-between bg-zinc-800 rounded-lg p-3">
          <div className="flex items-center">
            {attachmentPreview ? (
              <img
                src={attachmentPreview}
                alt="Attachment preview"
                className="w-12 h-12 object-cover rounded mr-3"
              />
            ) : (
              <div className="bg-zinc-700 rounded-lg w-12 h-12 flex items-center justify-center mr-3">
                <PaperclipIcon size={20} />
              </div>
            )}
            <div className="max-w-[200px] truncate">
              <p className="text-sm font-medium text-zinc-200 truncate">
                {attachment.name}
              </p>
              <p className="text-xs text-zinc-400">
                {(attachment.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={removeAttachment}
            className="text-zinc-400 hover:text-white"
          >
            <XIcon size={18} />
          </button>
        </div>
      )}

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex items-end space-x-2"
      >
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,video/*,audio/*"
            disabled={isSending || !!attachment}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-zinc-400 hover:text-white hover:bg-zinc-800 flex-shrink-0"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSending || !!attachment}
          >
            <PaperclipIcon size={18} />
          </Button>
        </div>

        <div className="flex-1">
          <Textarea
            ref={textAreaRef}
            placeholder={attachment ? "Add a caption (optional)" : "Type a message..."}
            className="min-h-8 max-h-[132px] bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-500 focus:border-rose-500 focus:ring-rose-500 resize-none"
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
          disabled={isSending || (!content.trim() && !attachment)}
        >
          <SendIcon size={18} />
        </Button>
      </form>
    </div>
  );
};
