import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const deleteSpareParts = ({ id }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      await axios.delete(`http://localhost:5000/api/spareparts/delete-spareparts/${id}`);
      navigate("/dashboard"); // Redirect after deletion
    } catch (error) {
      setError("Error deleting spare part");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Delete Spare Part</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
        {loading ? "Deleting..." : "Delete Spare Part"}
      </button>
    </div>
  );
};

export default deleteSpareParts;
