import { createFileRoute } from "@tanstack/react-router";
import { ChatListPanel } from "./app";

export const Route = createFileRoute("/app/chats/")({
  component: () => (
    <>
      <ChatListPanel />
      <div className="hidden md:flex flex-1 items-center justify-center text-muted-foreground">
        Select a chat to start messaging.
      </div>
    </>
  ),
});
