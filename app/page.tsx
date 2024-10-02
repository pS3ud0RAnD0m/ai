// app/page.tsx
import { Button } from "@/app/components/ui/button";

export default function HomePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome to the AI Chat App</h1>
      <p>
        This is the home page. Navigate to the chat to start a conversation!
      </p>
      <Button className="mt-4">Get Started</Button>
    </div>
  );
}
