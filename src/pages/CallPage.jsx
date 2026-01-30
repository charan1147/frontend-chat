import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import CallScreen from "../components/CallScreen";

const CallPage = () => {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  if (!user) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="container mt-4 text-center">
      <CallScreen />
      <button
        className="btn btn-outline-warning mt-3"
        onClick={() => navigate(`/chat/${contactId}`)}
      >
        Back to Chat
      </button>
    </div>
  );
};

export default CallPage;
