import { io } from "socket.io-client";

const URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5016";
const token = localStorage.getItem("token");

const socket = io(URL, {
  autoConnect: false,
  withCredentials: true,
  auth: {
    token: token ? `Bearer ${token}` : null,
  },
});

socket.on("connect_error", (err) => {
  console.error("Socket connection failed:", err.message);
});

socket.on("reconnect_attempt", () => {
  console.log("Reconnecting to socket...");
});

export default socket;
