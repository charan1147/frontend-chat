import React, { useState, useContext } from "react";
import { ContactContext } from "../context/ContactContext";

const AddContact = () => {
  const [email, setEmail] = useState("");
  const { addContactToList, error } = useContext(ContactContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    await addContactToList(trimmedEmail);
    setEmail("");
  };

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Add New Contact</h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="contactEmail" className="form-label">
                Contact Email
              </label>
              <input
                type="email"
                id="contactEmail"
                className="form-control"
                placeholder="Enter contact email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-success">
              Add Contact
            </button>

            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddContact;
