// Product_Form.jsx
import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const Product_Form = ({ onSubmit, categories }) => {
  const [product, setProduct] = useState({
    id: '',
    name: '',
    price: '',
    stock: '',
    category: '',
    image: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
    setSuccessMessage(false);
  };

  const handleCloseModal = () => setShowModal(false);

  const inputChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProduct({ ...product, image: file });
  };

  const formSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price);
    formData.append('stock', product.stock);
    formData.append('category', product.category);
    formData.append('image', product.image);

    onSubmit(formData);
    setProduct({ id: '', name: '', price: '', stock: '', category: '', image: null });
    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false);
      handleCloseModal();
    }, 500);
  };

  return (
    <>
      <Button className="mt-4 btn btn-primary" onClick={handleShowModal}>
        Add +
      </Button>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={formSubmit}>
            <label>Name:</label>
            <input type="text" name="name" value={product.name} onChange={inputChange} required />

            <label>Price:</label>
            <input type="number" name="price" value={product.price} onChange={inputChange} required />

            <label>Stock:</label>
            <input type="number" name="stock" value={product.stock} onChange={inputChange} required />

            <label>Category:</label>
            <select name="category" value={product.category} onChange={inputChange} required>
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <label>Image:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />

            <button type="submit">Add</button>
          </form>
          {successMessage && <p style={{ color: 'green' }}> Product added successfully!</p>}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Product_Form;
