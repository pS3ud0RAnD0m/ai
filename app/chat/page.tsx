// app/chat/page.tsx
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";

export default function ChatPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Placeholder messages */}
        <div className="bg-gray-800 p-4 rounded-lg">User: Hello!</div>
        <div className="bg-gray-700 p-4 rounded-lg self-end">
          AI: Hi! How can I assist you today?
        </div>
      </div>
      <div className="p-4 bg-gray-800">
        <Textarea placeholder="Type your message..." className="mb-4 w-full" />
        <Button className="mt-2">Send</Button>
      </div>
    </div>
  );
}
