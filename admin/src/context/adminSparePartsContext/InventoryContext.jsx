import { createContext, useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'

export const InventoryContext = createContext()

const InventoryContextProvider = (props) => {
    const [spareParts, setSpareParts] = useState([])
    const [dashData, setDashData] = useState(null)
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    // Get all spare parts
    const getAllSpareParts = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/inventory/get-all-spareparts')
            if (data.success) {
                setSpareParts(data.spareParts)
                return data // Add this return statement
                console.log(data.spareParts);

            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to fetch parts')
            console.log(error);
            return { success: false } // Return error state
        }
    }

    // Add new spare part
    const addSparePart = async (formData) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/inventory/add-spareparts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            if (data.success) {
                toast.success('Part added successfully')
            }
            else {
                console.log();
            }
            return data
        } catch (error) {
            toast.error(error.response?.data?.error || 'Add part failed')
            console.log(error);
        }
    }

    // Update spare part
    const updateSparePart = async (id, formData) => {
        try {
            const { data } = await axios.patch(`${backendUrl}/api/inventory/update-spareparts/${id}`, formData);
            if (data.success) {
                toast.success('Part updated successfully')
                await getAllSpareParts()
            }
            return data
        } catch (error) {
            toast.error(error.response?.data?.error || 'Update failed')
            console.log(error);

        }
    }

    // Delete spare part
    // Update deleteSparePart function
    const deleteSparePart = async (id) => {
        try {
            const { data } = await axios.delete(`${backendUrl}/api/inventory/delete-spareparts/${id}`)
            if (data.success) {
                setSpareParts(prev => prev.filter(part => part._id !== id))
                toast.success('Part deleted successfully')
                return true // Return success status
            }
            return false
        } catch (error) {
            toast.error(error.response?.data?.error || 'Delete failed')
            return false
        }
    }

    // Add these functions
    const getTotalCount = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/inventory/total-count')
            if (data.success) return data.totalCount
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to get count')
        }
        return 0
    }

    const getTotalValue = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/inventory/total-value')
            if (data.success) return data.totalValue
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to get total value')
        }
        return 0
    }

    const value = {
        spareParts,
        getAllSpareParts,
        addSparePart,
        updateSparePart,
        deleteSparePart,
        dashData,
        getTotalCount,
        getTotalValue
    }

    return (
        <InventoryContext.Provider value={value}>
            {props.children}
        </InventoryContext.Provider>
    )
}

export default InventoryContextProvider