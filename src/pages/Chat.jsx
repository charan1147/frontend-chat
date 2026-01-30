import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CallContext } from "../context/CallContext";
import { ChatContext } from "../context/ChatContext";
import api from "../services/api";
import ChatBox from "../components/Chat/ChatBox";
import useWebSocket from "../hooks/useWebSocket";

const Chat = () => {
  const { contactId } = useParams();
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const { callUser, error: callError } = useContext(CallContext);
  const { messages, setMessages } = useContext(ChatContext);

  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!contactId) return;

    const fetchMessages = async () => {
      try {
        const res = await api.getMessages(contactId);
        const msgs = Array.isArray(res.data.messages) ? res.data.messages : [];
        setMessages(msgs);
        setError("");
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to fetch messages");
        setMessages([]); 
      }
    };

    fetchMessages();
  }, [contactId, setMessages]);

  const handleReceive = (msg) => {
    const isRelated =
      (msg.sender === contactId && msg.receiver === user._id) ||
      (msg.sender === user._id && msg.receiver === contactId);

    if (isRelated) {
      setMessages((prev) => [...prev, msg]);
    }
  };

  useWebSocket(handleReceive);

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      const res = await api.sendMessage(contactId, input);
      setMessages((prev) => [
        ...prev,
        {
          _id: res.data._id || Date.now().toString(),
          sender: { _id: user._id, name: user.name || user.email },
          receiver: contactId,
          content: input,
          createdAt: new Date(),
        },
      ]);
      setInput("");
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send message");
    }
  };

  const startCall = (isVideo) => {
    callUser(contactId, isVideo);
    navigate(`/call/${contactId}`);
  };

  if (!user || !contactId) {
    return <p className="text-center mt-4">Loading...</p>;
  }

  return (
    <div className="container my-4">
      {(error || callError) && (
        <div className="alert alert-danger">{error || callError}</div>
      )}

      <ChatBox messages={messages} currentUserId={user._id} />

      <div className="d-flex mt-3">
        <input
          className="form-control me-2"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="btn btn-primary" onClick={sendMessage}>
          Send
        </button>
      </div>

      <div className="mt-3 d-flex gap-2">
        <button className="btn btn-success" onClick={() => startCall(true)}>
          Video Call
        </button>
        <button className="btn btn-secondary" onClick={() => startCall(false)}>
          Audio Call
        </button>
      </div>
    </div>
  );
};

export default Chat;
