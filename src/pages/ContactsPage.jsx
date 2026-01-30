import React from "react";
import Contacts from "./Contacts";
import AddContact from "../components/AddContact";

const ContactsPage = () => {
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <Contacts />
        </div>
        <div className="col-md-6">
          <AddContact />
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;
