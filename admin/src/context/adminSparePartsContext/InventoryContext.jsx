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
            const { data } = await axios.get(backendUrl + '/api/inventory/all')
            if (data.success) {
                setSpareParts(data.spareParts)
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to fetch parts')
        }
    }

    // Add new spare part
    const addSparePart = async (formData) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/inventory/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            if (data.success) {
                await getAllSpareParts()
                toast.success('Part added successfully')
            }
            return data
        } catch (error) {
            toast.error(error.response?.data?.error || 'Add part failed')
        }
    }

    // Update spare part
    const updateSparePart = async (id, formData) => {
        try {
            const { data } = await axios.put(`${backendUrl}/api/inventory/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            if (data.success) {
                await getAllSpareParts()
                toast.success('Part updated successfully')
            }
            return data
        } catch (error) {
            toast.error(error.response?.data?.error || 'Update failed')
        }
    }

    // Delete spare part
    const deleteSparePart = async (id) => {
        try {
            const { data } = await axios.delete(`${backendUrl}/api/inventory/delete/${id}`)
            if (data.success) {
                setSpareParts(prev => prev.filter(part => part._id !== id))
                toast.success('Part deleted successfully')
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Delete failed')
        }
    }

    const value = {
        spareParts,
        getAllSpareParts,
        addSparePart,
        updateSparePart,
        deleteSparePart,
        dashData
    }

    return (
        <InventoryContext.Provider value={value}>
            {props.children}
        </InventoryContext.Provider>
    )
}

export default InventoryContextProvider