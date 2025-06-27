import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  MoreVerticalIcon,
  SendIcon,
  PaperclipIcon,
  SmileIcon,
  InfoIcon,
} from "lucide-react";

export default function ChatMain() {
  const messages = [
    {
      id: 1,
      sender: "Sarah Johnson",
      content: "Hey! How's your day going?",
      timestamp: "10:30 AM",
      isOwn: false,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 2,
      sender: "You",
      content: "Pretty good! Just working on some new features. How about you?",
      timestamp: "10:32 AM",
      isOwn: true,
    },
    {
      id: 3,
      sender: "Sarah Johnson",
      content:
        "Same here! I'm excited about the new dark theme design. It looks amazing! 🎨",
      timestamp: "10:33 AM",
      isOwn: false,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 4,
      sender: "You",
      content:
        "Thanks! I spent quite a bit of time getting the colors just right. The rose accents really make it pop.",
      timestamp: "10:35 AM",
      isOwn: true,
    },
    {
      id: 5,
      sender: "Sarah Johnson",
      content:
        "The contrast is perfect and it's easy on the eyes. When will it be ready for production?",
      timestamp: "10:36 AM",
      isOwn: false,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 6,
      sender: "You",
      content:
        "Should be ready by the end of this week. Just need to finish up the authentication pages and we're good to go! 🚀",
      timestamp: "10:38 AM",
      isOwn: true,
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Chat Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback className="bg-zinc-700 text-zinc-300">
                  SJ
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-900"></div>
            </div>
            <div>
              <h2 className="text-white font-semibold">Sarah Johnson</h2>
              <p className="text-sm text-green-400">Online</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <InfoIcon size={18} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <MoreVerticalIcon size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 min-h-0 bg-zinc-950">
        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isOwn ? "justify-end" : "justify-start"
              } space-x-2`}
            >
              {!message.isOwn && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={message.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-zinc-700 text-zinc-300 text-xs">
                    SJ
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-xs lg:max-w-md ${
                  message.isOwn ? "order-1" : ""
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    message.isOwn
                      ? "bg-rose-600 text-white"
                      : "bg-zinc-800 text-zinc-200"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                <p
                  className={`text-xs text-zinc-500 mt-1 ${
                    message.isOwn ? "text-right" : "text-left"
                  }`}
                >
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="bg-zinc-900 border-t border-zinc-800 p-4">
        <div className="flex items-end space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-zinc-400 hover:text-white hover:bg-zinc-800 flex-shrink-0"
          >
            <PaperclipIcon size={18} />
          </Button>

          <div className="flex-1">
            <Textarea
              placeholder="Type a message..."
              className="min-h-[40px] max-h-[132px] bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-500 focus:border-rose-500 focus:ring-rose-500 resize-none"
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
            size="sm"
            className="bg-rose-600 hover:bg-rose-700 text-white flex-shrink-0"
          >
            <SendIcon size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
