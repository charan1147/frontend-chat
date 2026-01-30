import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ContactContext } from "../context/ContactContext";

const ContactList = () => {
  const { contacts } = useContext(ContactContext);
  const navigate = useNavigate();

if (!Array.isArray(contacts) || contacts.length === 0) {
  return <div>No contacts found.</div>;
}

{
  Array.isArray(contacts) &&
    contacts.map((contact) => <li key={contact._id}>{contact.name}</li>);
}


  const openChat = (id) => navigate(`/chat/${id}`);

  return (
    <ul className="list-group mt-3">
      {contacts.map(({ _id, name, email }) => (
        <li
          key={_id}
          className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
          onClick={() => openChat(_id)}
          role="button"
        >
          <span>{name || email}</span>
          <i className="bi bi-chat-dots-fill text-primary" />
        </li>
      ))}
    </ul>
  );
};

export default ContactList;
