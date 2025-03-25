import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Modal, Form } from 'react-bootstrap';

const SparePartsDashboard = () => {
    const [spareParts, setSpareParts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '', brand: '', modelNumber: '', quantity: '', price: '', color: '', dimensions: { length: '', width: '', height: '' }, image: null
    });

    useEffect(() => {
        fetchSpareParts();
    }, []);

    const fetchSpareParts = async () => {
        try {
            const response = await axios.get('/api/get-all-spareparts');
            setSpareParts(response.data);
        } catch (error) {
            console.error('Error fetching spare parts:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'dimensions') {
                Object.keys(formData.dimensions).forEach(dimKey => {
                    formDataToSend.append(`dimensions.${dimKey}`, formData.dimensions[dimKey]);
                });
            } else {
                formDataToSend.append(key, formData[key]);
            }
        });
        try {
            await axios.post('/api/add-spareparts', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setShowModal(false);
            fetchSpareParts();
        } catch (error) {
            console.error('Error adding spare part:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Spare Parts Dashboard</h2>
            <Button variant="primary" onClick={() => setShowModal(true)}>Add Spare Part</Button>
            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Brand</th>
                        <th>Model</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Color</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>
                    {spareParts.map(part => (
                        <tr key={part._id}>
                            <td>{part.name}</td>
                            <td>{part.brand}</td>
                            <td>{part.modelNumber}</td>
                            <td>{part.quantity}</td>
                            <td>${part.price}</td>
                            <td>{part.color}</td>
                            <td><img src={part.image} alt={part.name} width="50" /></td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Spare Part</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="name" onChange={handleInputChange} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Brand</Form.Label>
                            <Form.Control type="text" name="brand" onChange={handleInputChange} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Model Number</Form.Label>
                            <Form.Control type="text" name="modelNumber" onChange={handleInputChange} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control type="number" name="quantity" onChange={handleInputChange} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" name="price" onChange={handleInputChange} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Color</Form.Label>
                            <Form.Control type="text" name="color" onChange={handleInputChange} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} required />
                        </Form.Group>
                        <Button type="submit" variant="success" className="mt-3">Add</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default SparePartsDashboard;
