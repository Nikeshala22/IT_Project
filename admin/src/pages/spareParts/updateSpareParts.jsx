import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateSpareParts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    modelNumber: "",
    dimensions: { length: "", width: "", height: "" },
    quantity: "",
    price: "",
    color: "",
    image: null,
  });
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSparePart = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/spareparts/view-sparepart/${id}`);
        setFormData(response.data);
      } catch (error) {
        setError("Error fetching spare part details");
      }
    };
    
    fetchSparePart();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("dimensions")) {
      const dimension = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        dimensions: { ...prevData.dimensions, [dimension]: value },
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({ ...prevData, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "dimensions") {
        Object.keys(formData[key]).forEach((dim) => {
          form.append(`dimensions.${dim}`, formData[key][dim]);
        });
      } else {
        form.append(key, formData[key]);
      }
    });

    try {
      await axios.patch(`http://localhost:5000/api/spareparts/update-spareparts/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Update Spare Part</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        {/* Similar fields as in AddSpareParts with values populated from formData */}
        {/* ... */}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Updating..." : "Update Spare Part"}
        </button>
      </form>
    </div>
  );
};

export default UpdateSpareParts;
