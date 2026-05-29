import { createFileRoute, Link } from "@tanstack/react-router";
import { ChatListPanel } from "./app";
import { MessageSquare, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/")({
  component: AppHome,
});

function AppHome() {
  return (
    <>
      <ChatListPanel />
      <div className="hidden md:flex flex-1 flex-col items-center justify-center p-10 text-center">
        <div className="relative">
          <div className="absolute -inset-10 bg-gradient-to-br from-[var(--neon)]/30 to-[var(--neon-2)]/30 blur-3xl -z-10" />
          <div className="h-20 w-20 mx-auto rounded-3xl bg-gradient-to-br from-[var(--neon)] via-[var(--primary)] to-[var(--neon-2)] flex items-center justify-center glow-primary animate-float">
            <MessageSquare className="h-9 w-9 text-white" />
          </div>
        </div>
        <h2 className="mt-8 text-3xl font-bold">Welcome to <span className="text-gradient">NebulaChat</span></h2>
        <p className="mt-2 text-muted-foreground max-w-sm">Pick a conversation from the left, or start something new.</p>
        <div className="mt-6 flex gap-3">
          <Link to="/app/chats/$id" params={{ id: "1" }} className="inline-flex h-11 items-center gap-2 px-5 rounded-full bg-gradient-to-r from-[var(--neon)] to-[var(--primary)] text-white text-sm glow-primary">
            <Sparkles className="h-4 w-4" /> Open featured chat
          </Link>
        </div>
      </div>
    </>
  );
}
