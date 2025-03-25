import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddSpareParts = () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("dimensions")) {
      const dimension = name.split(".")[1]; // 'length', 'width', or 'height'
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
      await axios.post("http://localhost:5174/api/spareparts/add-spareparts", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/dashboard"); // Redirect after adding
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Add New Spare Part</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Brand</label>
          <input
            type="text"
            className="form-control"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Model Number</label>
          <input
            type="text"
            className="form-control"
            name="modelNumber"
            value={formData.modelNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Dimensions</label>
          <div>
            <input
              type="number"
              className="form-control"
              name="dimensions.length"
              placeholder="Length"
              value={formData.dimensions.length}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              className="form-control"
              name="dimensions.width"
              placeholder="Width"
              value={formData.dimensions.width}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              className="form-control"
              name="dimensions.height"
              placeholder="Height"
              value={formData.dimensions.height}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            className="form-control"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Color</label>
          <input
            type="text"
            className="form-control"
            name="color"
            value={formData.color}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Image</label>
          <input
            type="file"
            className="form-control"
            name="image"
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Adding..." : "Add Spare Part"}
        </button>
      </form>
    </div>
  );
};

export default AddSpareParts;
