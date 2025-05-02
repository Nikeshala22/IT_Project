import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InventoryContext } from "../../context/inventryContext/inventryContext.jsx";

const SpareParts = () => {
    const { brand } = useParams();
    const navigate = useNavigate();
    const { spareParts = [] , getSparePartsData} = useContext(InventoryContext);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            await getSparePartsData();
            setLoading(false);
        };
        fetchData();
        }, []);

        if (loading) {
        return (
            <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading spare parts...</p>
            </div>
        );
    }

    // Get unique brands safely
    const brands = [...new Set(
        Array.isArray(spareParts) 
            ? spareParts.map(part => part.brand).filter(Boolean) 
            : []
    )].sort();

    // Combined filtering logic
    const filteredParts = (Array.isArray(spareParts) ? spareParts : [])
        .filter(part => {
            const matchesSearch = part.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                part.modelNumber?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesBrand = selectedBrands.length === 0 || 
                               selectedBrands.includes(part.brand);
            return matchesSearch && matchesBrand;
        });

    // Toggle brand selection
    const toggleBrand = (brandName) => {
        setSelectedBrands(prev => 
            prev.includes(brandName)
                ? prev.filter(b => b !== brandName)
                : [...prev, brandName]
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header and Search */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Spare Parts Inventory</h1>
                <div className="relative max-w-md">
                    <input
                        type="text"
                        placeholder="Search parts by name or model..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <svg 
                        className="absolute right-3 top-3 h-5 w-5 text-gray-400"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                        />
                    </svg>
                </div>
            </div>

            {/* Filters and Content */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Brand Filter Sidebar */}
                <div className="lg:w-64">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Filter Brands</h2>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="lg:hidden text-blue-600 hover:text-blue-700"
                            >
                                {showFilters ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        
                        <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
                            {brands.map(brandName => (
                                <label 
                                    key={brandName}
                                    className="flex items-center space-x-3 mb-3 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedBrands.includes(brandName)}
                                        onChange={() => toggleBrand(brandName)}
                                        className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-gray-700">{brandName}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Parts Grid */}
                <div className="flex-1">
                    {filteredParts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                {spareParts.length === 0 
                                    ? "Loading parts..." 
                                    : "No parts match your search criteria"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredParts.map((item) => (
                                <div 
                                    key={item._id}
                                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 overflow-hidden"
                                >
                                    <div className="h-48 bg-gray-50 flex items-center justify-center p-4">
                                        <img
                                            src={item.image || '/placeholder-image.jpg'}
                                            alt={item.name}
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className={`inline-block w-3 h-3 rounded-full ${
                                                item.quantity > 0 ? 'bg-green-500' : 'bg-red-500'
                                            }`}></span>
                                            <span className={`text-sm ${
                                                item.quantity > 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                {item.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                            {item.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-1">
                                            {item.brand} - {item.modelNumber}
                                        </p>
                                        <div className="flex justify-between items-center mt-4">
                                            <span className="text-lg font-bold text-blue-600">
                                                ${item.price.toFixed(2)}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                Qty: {item.quantity}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SpareParts;