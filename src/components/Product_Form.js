import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';

const Product_Form = ({ onSubmit, categories }) => {
  const [product, setProduct] = useState({
    id: '',
    name: '',
    price: '',
    stock: '',
    category: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [SuccessMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
  }, []);
  
  const handleShowModal = () => {
    setShowModal(true);
    setSuccessMessage(false); 
  };

  const handleCloseModal = () => setShowModal(false);

  const input_change = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const form_submit = (e) => {
    e.preventDefault();
    onSubmit(product);
    setProduct({ id: '', name: '', price: '', stock: '', category: '' });
    setSuccessMessage(true); 
    setTimeout(() => {
      setSuccessMessage(false); 
      handleCloseModal(); 
    }, 500); 
  };


  return (
    <>
    <Button class="mt-4 btn btn-primary " onClick={handleShowModal}>Add +</Button>
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Add Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={form_submit}>
      <label>Name:</label>
      <input
        type="text"
        name="name"
        value={product.name}
        onChange={input_change}
        required
      />

      <label>Price:</label>
      <input
        type="number"
        name="price"
        value={product.price}
        onChange={input_change}
        required
      />

      <label>Stock:</label>
      <input
        type="number"
        name="stock"
        value={product.stock}
        onChange={input_change}
        required
      />

      <label>Category:</label>
      <select
        name="category"
        value={product.category}
        onChange={input_change}
        required
      >
        <option value="" disabled>Select Category</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <button type="submit">Add</button>
    </form>
    {SuccessMessage && (
          <p style={{ color: 'green' }}> Product added successfully!</p>
        )}
      </Modal.Body>
    </Modal>
    </>
  );
};


export default Product_Form;