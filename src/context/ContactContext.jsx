import { createContext, useEffect, useState } from "react";
import api from "../services/api";

export const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null);

const loadContacts = async () => {
  try {
    const res = await api.getContacts();
    setContacts(res.data || []);
  } catch {
    setError("Failed to fetch contacts");
  }
};


  useEffect(() => {
    loadContacts();
  }, []);

  const addContactToList = async (email) => {
    await api.addContact(email);
    loadContacts();
  };

  return (
    <ContactContext.Provider value={{ contacts, addContactToList, error }}>
      {children}
    </ContactContext.Provider>
  );
};
