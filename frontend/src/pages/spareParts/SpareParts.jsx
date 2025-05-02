import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InventoryContext } from "../../context/inventryContext/inventryContext.jsx";

const SpareParts = () => {
    const { brand } = useParams();
    const [filteredParts, setFilteredParts] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const navigate = useNavigate();
    const { spareParts } = useContext(InventoryContext);

    // Get unique brands from spareParts
    const uniqueBrands = Array.from(new Set(spareParts.map(part => part.brand)));

    const applyFilter = () => {
        if (brand) {
            setFilteredParts(spareParts.filter(part => part.brand === brand));
        } else {
            setFilteredParts(spareParts);
        }
    };

    useEffect(() => {
        applyFilter();
    }, [spareParts, brand]);

    return (
        <div>
            <p className="text-gray-600">Browse through our inventory of spare parts.</p>
            <div className="flex flex-col gap-5 mt-5 sm:flex-row item-start">

                <button 
                    onClick={() => setShowFilter(prev => !prev)} 
                    className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
                        showFilter ? 'bg-[#5f6FFF] text-white' : '' // Updated primary color
                    }`}
                >
                    Filters
                </button>

                <div className={`flex-col gap-4 text-sm text-gray-600 ${
                    showFilter ? 'flex' : 'hidden sm:flex'
                }`}>
                    {uniqueBrands.map((brandName) => (
                        <p 
                            key={brandName}
                            onClick={() => 
                                brand === brandName 
                                    ? navigate('/spareparts') 
                                    : navigate(`/spareparts/${brandName}`)
                            }
                            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border rounded cursor-pointer ${
                                brand === brandName ? "bg-indigo-100 text-black" : ""
                            }`}
                        >
                            {brandName}
                        </p>
                    ))}
                </div>

                {/* Updated grid template columns */}
                <div className="grid w-full gap-4 grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-y-6">
                    {filteredParts.map((item, index) => (
                        <div 
                            className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' 
                            key={index}
                        >
                            <img 
                                className='bg-blue-50 h-48 w-full object-contain' 
                                src={item.image} 
                                alt={item.name} 
                            />
                            <div className='p-4'>
                                <div className={`flex items-center gap-2 text-sm ${
                                    item.quantity > 0 ? 'text-green-500' : 'text-gray-500'
                                }`}>
                                    <p className={`w-2 h-2 rounded-full ${
                                        item.quantity > 0 ? 'bg-green-500' : 'bg-gray-500'
                                    }`}></p>
                                    {item.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                                </div>
                                <p className='text-lg font-medium text-gray-900'>{item.name}</p>
                                <p className='text-sm text-gray-600'>{item.brand} - {item.modelNumber}</p>
                                <p className='text-sm font-semibold mt-2'>Price: ${item.price}</p>
                                <p className='text-sm text-gray-600'>Qty: {item.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SpareParts;