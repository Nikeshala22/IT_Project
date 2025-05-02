import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const InventoryContext = createContext();

const InventoryContextProvider = (props) => {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [spareParts, setSpareParts] = useState([]);
  
  const getSparePartsData = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/inventory/get-all-spareparts"
      );
      // Access the spareParts array from the response
      setSpareParts(data.spareParts); // Changed from data to data.spareParts
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const value = {
    spareParts,
    getSparePartsData,
    currencySymbol,
    backendUrl,
  };

  useEffect(() => {
    getSparePartsData();
  }, []);

  return (
    <InventoryContext.Provider value={value}>
      {props.children}
    </InventoryContext.Provider>
  );
};

export default InventoryContextProvider;
