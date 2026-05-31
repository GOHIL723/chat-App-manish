import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import { PhoneIncoming, PhoneOff, Mic, MicOff, Phone } from 'lucide-react';
import { toast } from 'sonner';

interface CallContextType {
  callUser: (id: string, name: string, avatar: string) => void;
  answerCall: () => void;
  endCall: () => void;
  toggleMute: () => void;
  isReceivingCall: boolean;
  caller: any;
  callAccepted: boolean;
  callEnded: boolean;
  stream: MediaStream | null;
  isMuted: boolean;
  activeCallUser: any; // The person we are currently in a call with
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { socket } = useSocket();
  const { user } = useAuth();

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [caller, setCaller] = useState<any>(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeCallUser, setActiveCallUser] = useState<any>(null); // To store who we're talking to

  const myAudioRef = useRef<HTMLAudioElement | null>(null);
  const userAudioRef = useRef<HTMLAudioElement | null>(null);
  const connectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    // Create audio elements dynamically
    if (!myAudioRef.current) {
      myAudioRef.current = new Audio();
      myAudioRef.current.muted = true; // Mute local audio
    }
    if (!userAudioRef.current) {
      userAudioRef.current = new Audio();
      userAudioRef.current.autoplay = true; // Auto-play remote audio
    }

    if (!socket) return;

    socket.on('incomingCall', (data: { from: string, name: string, avatar: string, signal: any }) => {
      if (callAccepted || isReceivingCall) {
        // If already in a call, we could send a busy signal, but for now just ignore or notify
        return;
      }
      setIsReceivingCall(true);
      setCaller(data);
    });

    socket.on('endCall', () => {
      cleanupCall(false);
      toast.info('Call ended');
    });

    return () => {
      socket.off('incomingCall');
      socket.off('endCall');
    };
  }, [socket, callAccepted, isReceivingCall]);

  const setupMedia = async () => {
    try {
      const currentStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      setStream(currentStream);
      if (myAudioRef.current) {
        myAudioRef.current.srcObject = currentStream;
      }
      return currentStream;
    } catch (err) {
      console.error("Failed to get media", err);
      toast.error("Microphone access denied or not available");
      return null;
    }
  };

  const cleanupCall = (emitEnd = true) => {
    if (emitEnd && socket && (activeCallUser || caller)) {
      socket.emit('endCall', { to: activeCallUser?.id || caller?.from });
    }
    setCallEnded(true);
    if (connectionRef.current) {
      connectionRef.current.close();
      connectionRef.current = null;
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsReceivingCall(false);
    setCallAccepted(false);
    setCaller(null);
    setActiveCallUser(null);
    setIsMuted(false);
  };

  const createPeerConnection = (targetUserId: string, currentStream: MediaStream) => {
    const peer = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    currentStream.getTracks().forEach(track => {
      peer.addTrack(track, currentStream);
    });

    peer.ontrack = (event) => {
      if (userAudioRef.current) {
        userAudioRef.current.srcObject = event.streams[0];
      }
    };

    peer.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('iceCandidate', { to: targetUserId, candidate: event.candidate });
      }
    };

    peer.onconnectionstatechange = () => {
      if (peer.connectionState === 'disconnected' || peer.connectionState === 'failed') {
        cleanupCall(false);
      }
    };

    return peer;
  };

  const callUser = async (id: string, name: string, avatar: string) => {
    const currentStream = await setupMedia();
    if (!currentStream) return;
    
    setCallEnded(false);
    setActiveCallUser({ id, name, avatar });
    
    const peer = createPeerConnection(id, currentStream);
    connectionRef.current = peer;

    // Handle Ice candidates from receiver
    socket?.on('iceCandidate', async (candidate) => {
      if (connectionRef.current) {
        try {
          await connectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error("Error adding ice candidate", e);
        }
      }
    });

    // Handle when receiver answers
    socket?.on('callAccepted', async (signal) => {
      setCallAccepted(true);
      if (connectionRef.current) {
        await connectionRef.current.setRemoteDescription(new RTCSessionDescription(signal));
      }
      socket?.off('callAccepted'); // Clean up listener
    });

    try {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      socket?.emit('callUser', {
        userToCall: id,
        signalData: peer.localDescription,
        from: user?._id,
        name: user?.name,
        avatar: user?.avatar
      });
    } catch (e) {
      console.error("Error creating offer", e);
      cleanupCall(true);
    }
  };

  const answerCall = async () => {
    setCallAccepted(true);
    setCallEnded(false);
    setActiveCallUser({ id: caller.from, name: caller.name, avatar: caller.avatar });

    const currentStream = await setupMedia();
    if (!currentStream) {
      cleanupCall(true);
      return;
    }

    const peer = createPeerConnection(caller.from, currentStream);
    connectionRef.current = peer;

    socket?.on('iceCandidate', async (candidate) => {
      if (connectionRef.current) {
        try {
          await connectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error("Error adding ice candidate", e);
        }
      }
    });

    try {
      await peer.setRemoteDescription(new RTCSessionDescription(caller.signal));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      socket?.emit('answerCall', { to: caller.from, signal: peer.localDescription });
    } catch (e) {
      console.error("Error creating answer", e);
      cleanupCall(true);
    }
  };

  const endCall = () => {
    cleanupCall(true);
  };

  const toggleMute = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  return (
    <CallContext.Provider value={{
      callUser, answerCall, endCall, toggleMute,
      isReceivingCall, caller, callAccepted, callEnded, stream, isMuted, activeCallUser
    }}>
      {children}
      
      {/* ── GLOBAL INCOMING CALL MODAL ── */}
      {isReceivingCall && !callAccepted && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-strong border border-[var(--neon)]/30 rounded-3xl p-6 w-full max-w-sm shadow-2xl flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <div className="relative">
              <img src={caller?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${caller?.name}`} className="h-24 w-24 rounded-full ring-4 ring-[var(--neon)]/50" alt="" />
              <div className="absolute inset-0 rounded-full animate-ping ring-4 ring-[var(--neon)]/50" />
            </div>
            <h2 className="text-xl font-bold mt-4">{caller?.name}</h2>
            <p className="text-sm text-muted-foreground mb-8 animate-pulse">Incoming voice call...</p>
            
            <div className="flex w-full gap-4">
              <button onClick={() => cleanupCall(true)} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center group-hover:bg-destructive group-hover:text-white transition">
                  <PhoneOff className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium">Decline</span>
              </button>
              <button onClick={answerCall} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="h-12 w-12 rounded-full bg-[var(--success)]/10 text-[var(--success)] flex items-center justify-center group-hover:bg-[var(--success)] group-hover:text-white transition">
                  <PhoneIncoming className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium">Answer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── GLOBAL ACTIVE CALL UI (FLOATING) ── */}
      {activeCallUser && callAccepted && !callEnded && (
        <div className="fixed top-4 right-4 z-[90] glass-strong border border-[var(--neon)]/40 rounded-2xl p-4 shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-4">
          <div className="relative">
            <img src={activeCallUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeCallUser.name}`} className="h-12 w-12 rounded-full ring-2 ring-[var(--neon)]" alt="" />
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-[var(--neon)] rounded-full border-2 border-background animate-pulse" />
          </div>
          <div className="flex-1 min-w-[120px]">
            <div className="font-semibold text-sm truncate">{activeCallUser.name}</div>
            <div className="text-xs text-[var(--neon)] flex items-center gap-1">
              Call in progress <span className="flex gap-0.5"><span className="h-1 w-1 bg-[var(--neon)] rounded-full animate-bounce" /><span className="h-1 w-1 bg-[var(--neon)] rounded-full animate-bounce delay-75" /><span className="h-1 w-1 bg-[var(--neon)] rounded-full animate-bounce delay-150" /></span>
            </div>
          </div>
          <div className="flex items-center gap-2 border-l border-border/50 pl-4 ml-2">
            <button onClick={toggleMute} className={`h-10 w-10 rounded-full flex items-center justify-center transition ${isMuted ? 'bg-destructive/10 text-destructive' : 'glass hover:bg-accent'}`}>
              {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
            <button onClick={endCall} className="h-10 w-10 rounded-full bg-destructive flex items-center justify-center text-white hover:scale-105 transition shadow-lg shadow-destructive/20">
              <PhoneOff className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── CALLING (OUTGOING RINGING) UI ── */}
      {activeCallUser && !callAccepted && !callEnded && !isReceivingCall && (
        <div className="fixed top-4 right-4 z-[90] glass-strong border border-border/50 rounded-2xl p-4 shadow-2xl flex items-center gap-4 animate-in slide-in-from-top-4">
          <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center animate-pulse">
            <Phone className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-[120px]">
            <div className="font-semibold text-sm truncate">{activeCallUser.name}</div>
            <div className="text-xs text-muted-foreground">Calling...</div>
          </div>
          <button onClick={endCall} className="h-10 w-10 rounded-full bg-destructive flex items-center justify-center text-white hover:scale-105 transition">
            <PhoneOff className="h-4 w-4" />
          </button>
        </div>
      )}
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (context === undefined) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
};
