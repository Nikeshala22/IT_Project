import React, { useState, useContext } from "react";
import { assets } from "../../assets/assets";
import { InventoryContext } from "../../context/adminSparePartsContext/InventoryContext";
import { toast } from 'react-toastify'
import axios from 'axios'

const AddSparePart = () => {
  const [partImg, setPartImg] = useState(false)
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [modelNumber, setModelNumber] = useState('')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [color, setColor] = useState('#000000')
  const [dimensions, setDimensions] = useState({
    length: '',
    width: '',
    height: ''
  })

  const { addSparePart } = useContext(InventoryContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      if (!partImg) {
        return toast.error("Image Not Selected!")
      }

      const formData = new FormData()
      formData.append('image', partImg)
      formData.append('name', name)
      formData.append('brand', brand)
      formData.append('modelNumber', modelNumber)
      formData.append('quantity', Number(quantity))
      formData.append('price', Number(price))
      formData.append('color', color)
      formData.append('dimensions.length', dimensions.length)
      formData.append('dimensions.width', dimensions.width)
      formData.append('dimensions.height', dimensions.height)

      const result = await addSparePart(formData)
      
      if (result?.success) {
        toast.success('Spare Part Added Successfully!')
        setPartImg(false)
        setName('')
        setBrand('')
        setModelNumber('')
        setQuantity('')
        setPrice('')
        setColor('#000000')
        setDimensions({ length: '', width: '', height: '' })
      }
      
    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  }

  const handleDimensionChange = (dimension, value) => {
    setDimensions(prev => ({
      ...prev,
      [dimension]: value
    }))
  }

  return (
    <form onSubmit={onSubmitHandler} className="w-full m-5">
      <p className="mb-3 text-lg font-medium">Add Spare Part</p>

      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="part-img">
            <img 
              src={partImg ? URL.createObjectURL(partImg) : assets.upload_area} 
              alt="" 
              className="w-16 bg-gray-100 rounded-full cursor-pointer" 
            />
          </label>
          <input 
            onChange={(e) => setPartImg(e.target.files[0])} 
            type="file" 
            id="part-img" 
            hidden 
          />
          <p>Upload Spare Part Image</p>
        </div>

        <div className="flex flex-col items-start gap-10 text-gray-600 lg:flex-row">
          {/* Left Column */}
          <div className="flex flex-col w-full gap-4 lg:flex-1">
            <div className="flex flex-col gap-1">
              <p>Part Name</p>
              <input 
                value={name}
                onChange={(e) => setName(e.target.value)} 
                type="text" 
                placeholder="Name" 
                className="px-3 py-2 border rounded" 
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p>Brand</p>
              <input 
                value={brand}
                onChange={(e) => setBrand(e.target.value)} 
                type="text" 
                placeholder="Brand" 
                className="px-3 py-2 border rounded" 
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p>Model Number</p>
              <input 
                value={modelNumber}
                onChange={(e) => setModelNumber(e.target.value)} 
                type="text" 
                placeholder="Model Number" 
                className="px-3 py-2 border rounded" 
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <p>Length (cm)</p>
                <input 
                  value={dimensions.length}
                  onChange={(e) => handleDimensionChange('length', e.target.value)}
                  type="number" 
                  step="0.01" 
                  className="px-3 py-2 border rounded" 
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <p>Width (cm)</p>
                <input 
                  value={dimensions.width}
                  onChange={(e) => handleDimensionChange('width', e.target.value)}
                  type="number" 
                  step="0.01" 
                  className="px-3 py-2 border rounded" 
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <p>Height (cm)</p>
                <input 
                  value={dimensions.height}
                  onChange={(e) => handleDimensionChange('height', e.target.value)}
                  type="number" 
                  step="0.01" 
                  className="px-3 py-2 border rounded" 
                  required
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col w-full gap-4 lg:flex-1">
            <div className="flex flex-col gap-1">
              <p>Quantity</p>
              <input 
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)} 
                type="number" 
                placeholder="Quantity" 
                className="px-3 py-2 border rounded" 
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p>Price ($)</p>
              <input 
                value={price}
                onChange={(e) => setPrice(e.target.value)} 
                type="number" 
                step="0.01" 
                placeholder="Price" 
                className="px-3 py-2 border rounded" 
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p>Color</p>
              <input 
                type="color" 
                value={color}
                onChange={(e) => setColor(e.target.value)} 
                className="w-full h-10 px-1 border rounded" 
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="px-10 py-3 mt-4 text-white rounded-full bg-primary"
        >
          Add Spare Part
        </button>
      </div>
    </form>
  );
};

export default AddSparePart;