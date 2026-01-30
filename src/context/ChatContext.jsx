import { createContext, useState } from "react";


export const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  return <ChatContext.Provider value={null}>{children}</ChatContext.Provider>;
};
