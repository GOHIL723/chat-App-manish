import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

export function useGroupChat(groupId: string) {
  const [group, setGroup] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [remoteTyping, setRemoteTyping] = useState<string[]>([]);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const { socket } = useSocket();
  const { user } = useAuth();

  const fetchGroup = useCallback(async () => {
    const res = await axios.get(`/groups/${groupId}`);
    setGroup(res.data);
  }, [groupId]);

  const fetchMessages = useCallback(async (p = 1) => {
    const res = await axios.get(`/groups/${groupId}/messages?page=${p}&limit=50`);
    const { messages: msgs, pagination } = res.data;
    if (p === 1) setMessages(msgs);
    else setMessages(prev => [...msgs, ...prev]);
    setHasMore(pagination.hasMore);
    setPage(p);
  }, [groupId]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    await fetchMessages(page + 1);
    setLoadingMore(false);
  };

  const sendMessage = async (payload: {
    message?: string;
    messageType?: string;
    media?: string;
    mediaPublicId?: string;
    mediaMimeType?: string;
    mediaSize?: number;
    audioDuration?: number;
    replyTo?: string | null;
  }) => {
    const res = await axios.post(`/groups/${groupId}/messages`, payload);
    setMessages(prev => [...prev, res.data]);
    return res.data;
  };

  const emitTyping = () => {
    if (!socket) return;
    socket.emit("groupTyping", { groupId });
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("groupStopTyping", { groupId });
    }, 2000);
  };

  useEffect(() => {
    fetchGroup();
    fetchMessages(1);
  }, [fetchGroup, fetchMessages]);

  // Join socket room + listen for events
  useEffect(() => {
    if (!socket) return;
    socket.emit("joinGroup", { groupId });

    const onNewMsg = ({ groupId: gid, message }: any) => {
      if (gid !== groupId) return;
      setMessages(prev => {
        if (prev.some(m => m._id === message._id)) return prev;
        return [...prev, message];
      });
    };

    const onGroupUpdated = (updated: any) => {
      if (updated._id === groupId || String(updated._id) === groupId) setGroup(updated);
    };

    const onTyping = ({ senderId }: any) => {
      setRemoteTyping(p => p.includes(senderId) ? p : [...p, senderId]);
    };

    const onStopTyping = ({ senderId }: any) => {
      setRemoteTyping(p => p.filter(id => id !== senderId));
    };

    socket.on("newGroupMessage", onNewMsg);
    socket.on("groupUpdated", onGroupUpdated);
    socket.on("groupTyping", onTyping);
    socket.on("groupStopTyping", onStopTyping);

    return () => {
      socket.emit("leaveGroup", { groupId });
      socket.off("newGroupMessage", onNewMsg);
      socket.off("groupUpdated", onGroupUpdated);
      socket.off("groupTyping", onTyping);
      socket.off("groupStopTyping", onStopTyping);
    };
  }, [socket, groupId]);

  return { group, setGroup, messages, hasMore, loadingMore, loadMore, sendMessage, emitTyping, remoteTyping, currentUser: user };
}
