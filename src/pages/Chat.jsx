import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CallContext } from "../context/CallContext";
import api from "../services/api";
import ChatBox from "../components/Chat/ChatBox";
import useWebSocket from "../hooks/useWebSocket";

const Chat = () => {
  const { contactId } = useParams();
  const { user } = useContext(AuthContext);
  const { callUser, error: callError } = useContext(CallContext);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contactId || !user?._id) return;

    const fetchMessages = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await api.getMessages(contactId);
        setMessages(res.data || []);
      } catch (err) {
        console.error("Failed to load messages:", err);
        setError("Failed to load previous messages");
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [contactId, user?._id]);

  const handleNewMessage = (msg) => {
    if (
      (msg.sender === contactId && msg.receiver === user._id) ||
      (msg.sender === user._id && msg.receiver === contactId)
    ) {
      setMessages((prev) => [...prev, msg]);
    }
  };

  useWebSocket(handleNewMessage);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const messageText = input.trim();
    setInput("");
    const optimisticMsg = {
      _id: `temp-${Date.now()}`,
      sender: user._id,
      content: messageText,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const res = await api.sendMessage(contactId, messageText);
      setMessages((prev) =>
        prev.map((m) =>
          m._id === optimisticMsg._id
            ? { ...res.data, sender: { _id: user._id } }
            : m,
        ),
      );
    } catch (err) {
      console.error(err);
      setError("Failed to send message");
      setMessages((prev) => prev.filter((m) => m._id !== optimisticMsg._id));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!user) {
    return <div className="text-center mt-5">Please log in to chat</div>;
  }

  return (
    <div className="container my-4">
      {loading && <div className="text-center my-5">Loading messages...</div>}

      {(error || callError) && (
        <div className="alert alert-danger mb-3">{error || callError}</div>
      )}

      <ChatBox messages={messages} currentUserId={user._id} />

      <div className="input-group mt-3">
        <textarea
          className="form-control"
          placeholder="Type a message..."
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ resize: "none" }}
        />
        <button
          className="btn btn-primary"
          onClick={sendMessage}
          disabled={!input.trim() || loading}
        >
          Send
        </button>
      </div>

      <div className="mt-3 d-flex gap-2">
        <button
          className="btn btn-success"
          onClick={() => callUser(contactId, true)}
        >
          Video Call
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => callUser(contactId, false)}
        >
          Audio Call
        </button>
      </div>
    </div>
  );
};

export default Chat;
