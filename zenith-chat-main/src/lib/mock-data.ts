export type Chat = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  type: "dm" | "group";
  typing?: boolean;
};

export type Message = {
  id: string;
  author: string;
  avatar: string;
  text: string;
  time: string;
  me?: boolean;
  status?: "sent" | "delivered" | "seen";
  reactions?: { emoji: string; count: number }[];
  attachment?: { type: "image" | "voice" | "file"; url?: string; name?: string; duration?: string };
  reply?: { author: string; text: string };
};

const av = (seed: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

export const chats: Chat[] = [
  { id: "1", name: "Aurora Lin", avatar: av("aurora"), lastMessage: "Just sent the design files ✨", time: "2m", unread: 3, online: true, type: "dm", typing: true },
  { id: "2", name: "Design Crew", avatar: av("crew"), lastMessage: "Mira: Loving the new gradient system", time: "8m", unread: 12, online: true, type: "group" },
  { id: "3", name: "Kai Nakamura", avatar: av("kai"), lastMessage: "Voice message", time: "1h", unread: 0, online: true, type: "dm" },
  { id: "4", name: "Product Standup", avatar: av("product"), lastMessage: "Meeting starts in 15", time: "3h", unread: 0, online: false, type: "group" },
  { id: "5", name: "Sienna Park", avatar: av("sienna"), lastMessage: "Catch up tomorrow?", time: "1d", unread: 0, online: false, type: "dm" },
  { id: "6", name: "Engineering", avatar: av("eng"), lastMessage: "Deploy successful 🚀", time: "1d", unread: 0, online: true, type: "group" },
  { id: "7", name: "Theo Castillo", avatar: av("theo"), lastMessage: "Thanks!", time: "2d", unread: 0, online: false, type: "dm" },
  { id: "8", name: "Late Night Lounge", avatar: av("lounge"), lastMessage: "🎵 sharing tunes", time: "3d", unread: 0, online: true, type: "group" },
];

export const messages: Message[] = [
  { id: "m1", author: "Aurora Lin", avatar: av("aurora"), text: "Hey! Did you get a chance to look at the new mockups?", time: "10:32" },
  { id: "m2", author: "Aurora Lin", avatar: av("aurora"), text: "I think the glassmorphism direction is really landing.", time: "10:32", reactions: [{ emoji: "🔥", count: 2 }] },
  { id: "m3", author: "me", avatar: av("me"), me: true, text: "Yes! The depth feels next-level. Loving the neon accent on CTAs.", time: "10:35", status: "seen" },
  { id: "m4", author: "Aurora Lin", avatar: av("aurora"), text: "", time: "10:36", attachment: { type: "image", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80" } },
  { id: "m5", author: "me", avatar: av("me"), me: true, text: "This palette is gorgeous 😍", time: "10:37", status: "seen", reply: { author: "Aurora Lin", text: "Image" } },
  { id: "m6", author: "Aurora Lin", avatar: av("aurora"), text: "", time: "10:40", attachment: { type: "voice", duration: "0:34" } },
  { id: "m7", author: "me", avatar: av("me"), me: true, text: "Let's ship it this week 🚀", time: "10:42", status: "delivered" },
];
