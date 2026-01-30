import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <div className="card shadow text-center">
        <div className="card-body">
          <h1 className="text-primary mb-3">💬 Chat App</h1>

          <p className="text-muted">
            Simple, fast and secure messaging application
          </p>

          {user ? (
            <>
              <h5 className="mt-4">
                Welcome, <strong>{user.name || user.email}</strong>
              </h5>

              <div className="d-flex justify-content-center gap-3 mt-4">
                <button
                  className="btn btn-success"
                  onClick={() => navigate("/contacts")}
                >
                  View Contacts
                </button>

                <button
                  className="btn btn-outline-primary"
                  onClick={() => navigate("/chat")}
                >
                  Start Chat
                </button>
              </div>
            </>
          ) : (
            <p className="mt-4 text-danger">Please login to start chatting</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
