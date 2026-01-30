import { createContext, useContext, useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import socket from "../websocket/Socket";
import { getRoomId } from "../services/api";
import api from "../services/api";
import { AuthContext } from "./AuthContext";

export const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const peerRef = useRef(null);

  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?._id) return;

    socket.connect();
    socket.emit("register", user._id);

    socket.on("call:user", (data) =>
      setCall({ ...data, isReceivingCall: true }),
    );
    socket.on("call:accepted", ({ signal }) => {
      setCallAccepted(true);
      peerRef.current?.signal(signal);
    });
    socket.on("call:ended", endCall);

    return () => socket.off();
  }, [user?._id]);

  const getStream = () =>
    navigator.mediaDevices.getUserMedia({ video: true, audio: true });

  const callUser = async (receiverId, isVideo) => {
    const stream = await getStream();
    setLocalStream(stream);

    const roomId = getRoomId(user._id, receiverId);
    peerRef.current = new Peer({ initiator: true, stream });

    peerRef.current.on("signal", async (signal) => {
      await api.startCall(receiverId, isVideo ? "video" : "audio");
      socket.emit("callUser", { receiverId, signal, roomId });
    });

    peerRef.current.on("stream", setRemoteStream);
  };

  const answerCall = async () => {
    const stream = await getStream();
    setLocalStream(stream);
    setCallAccepted(true);

    peerRef.current = new Peer({ initiator: false, stream });
    peerRef.current.signal(call.signal);

    peerRef.current.on("signal", (signal) =>
      socket.emit("answerCall", { signal, roomId: call.roomId }),
    );
    peerRef.current.on("stream", setRemoteStream);
  };

  const endCall = async () => {
    peerRef.current?.destroy();
    localStream?.getTracks().forEach((t) => t.stop());
    await api.endCall(call.roomId);
    setCall({});
    setCallAccepted(false);
    setLocalStream(null);
    setRemoteStream(null);
    socket.emit("endCall", { roomId: call.roomId });
  };

  return (
    <CallContext.Provider
      value={{
        call,
        callAccepted,
        localStream,
        remoteStream,
        callUser,
        answerCall,
        endCall,
        error,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
