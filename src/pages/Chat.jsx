import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import ChatBox from "../components/Chat/ChatBox";
import useWebSocket from "../hooks/useWebSocket";

const Chat = () => {
  const { contactId } = useParams();
  const { user } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!contactId || !user?._id) return;

    const loadMessages = async () => {
      setLoading(true);
      try {
        const { data } = await api.getMessages(contactId);
        setMessages(Array.isArray(data) ? data : []);
      } catch {
        setError("Failed to load messages");
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [contactId, user?._id]);

  const handleNewMessage = (msg) => {
    if (
      msg.sender === contactId ||
      (msg.sender === user._id && msg.receiver === contactId)
    ) {
      setMessages((prev) => [...prev, msg]);
    }
  };

  useWebSocket(handleNewMessage);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    setInput("");

    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      _id: tempId,
      sender: user._id,
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimistic]);

    try {
      const { data } = await api.sendMessage(contactId, text);
      setMessages((prev) => prev.map((m) => (m._id === tempId ? data : m)));
    } catch {
      setError("Failed to send");
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!user) {
    return <div className="text-center mt-5">Please log in</div>;
  }

  return (
    <div className="container my-4">
      {loading && <div className="text-center my-5">Loading...</div>}

      {error && <div className="alert alert-danger mb-3">{error}</div>}

      <ChatBox messages={messages} currentUserId={user._id} />

      <div className="input-group mt-3">
        <textarea
          className="form-control"
          placeholder="Type a message..."
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleEnter}
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
    </div>
  );
};

export default Chat;
