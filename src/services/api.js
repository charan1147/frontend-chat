import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5016/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default {
  getMe: () => api.get("/auth/me"),

  login: async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    if (res.data.token) localStorage.setItem("token", res.data.token);
    return res.data;
  },

  register: async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    if (res.data.token) localStorage.setItem("token", res.data.token);
    return res.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    return api.post("/auth/logout");
  },

  getContacts: () => api.get("/contact/contacts"),
  addContact: (email) => api.post("/contact/add-contact", { email }),

  getMessages: (id, page = 1, limit = 50) =>
    api.get(`/messages/${id}?page=${page}&limit=${limit}`),

  sendMessage: (receiverId, content) =>
    api.post("/messages/send", { receiverId, content }),

  startCall: (receiverId, callType) =>
    api.post("/call/start", { receiverId, callType }),

  answerCall: (roomId) => api.post("/call/answer", { roomId }),
  endCall: (roomId) => api.post("/call/end", { roomId }),
};

export const getRoomId = (a, b) => [String(a), String(b)].sort().join("_");
