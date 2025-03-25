// sparePartsContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create context
export const SparePartsContext = createContext();

// SparePartsProvider component that provides the context to other components
export const SparePartsProvider = ({ children }) => {
    const [spareParts, setSpareParts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSpareParts();
    }, []);

    // Fetch all spare parts
    const fetchSpareParts = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/api/spareParts/get-all-spareparts");
            setSpareParts(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Add a spare part
    const addSparePart = async (formData) => {
        try {
            const response = await axios.post("/api/spareParts/add-spareparts", formData);
            setSpareParts([...spareParts, response.data.sparePart]);
        } catch (err) {
            setError(err.message);
        }
    };

    // Update a spare part
    const updateSparePart = async (id, updatedData) => {
        try {
            const response = await axios.patch(`/api/spareParts/update-spareparts/${id}`, updatedData);
            setSpareParts(spareParts.map(part => part._id === id ? response.data : part));
        } catch (err) {
            setError(err.message);
        }
    };

    // Delete a spare part
    const deleteSparePart = async (id) => {
        try {
            await axios.delete(`/api/spareParts/delete-spareparts/${id}`);
            setSpareParts(spareParts.filter(part => part._id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <SparePartsContext.Provider value={{ spareParts, loading, error, fetchSpareParts, addSparePart, updateSparePart, deleteSparePart }}>
            {children}
        </SparePartsContext.Provider>
    );
};
