import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';

const Stock_Form = ({ products, onUpdateStock, paymentCompleted }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [newStock, setNewStock] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [canUpdateStock, setCanUpdateStock] = useState(true);

  useEffect(() => {
    // Reset the canUpdateStock state after completing the payment
    if (paymentCompleted) {
      setCanUpdateStock(true);
    }
  }, [paymentCompleted]);

  const handleShowModal = () => {
    setShowModal(true);
    setUpdateSuccess(false);
  };

  const handleCloseModal = () => setShowModal(false);

  const change_product = (e) => {
    setSelectedProduct(e.target.value);
  };

  const change_stock = (e) => {
    setNewStock(e.target.value);
  };

  const form_submit = (e) => {
    e.preventDefault();

    const product = products.find((p) => p.id === selectedProduct);

    if (product) {
      onUpdateStock(product.id, parseInt(newStock, 10));
      setUpdateSuccess(true);
    }
    setSelectedProduct('');
    setNewStock('');
    setTimeout(() => {
      setShowModal(false);
    }, 500);
  };

  const inputElement = canUpdateStock ? (
    <input
      type="number"
      name="newStock"
      value={newStock}
      onChange={change_stock}
    />
  ) : (
    <input
      type="number"
      name="newStock"
      value={newStock}
      onChange={change_stock}
      disabled
    />
  );

  return (
    <>
      <Button onClick={handleShowModal} disabled={!canUpdateStock}>
        Update Stock
      </Button>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Stock</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={form_submit}>
            <label>Product:</label>
            <select value={selectedProduct} onChange={change_product} disabled={!canUpdateStock}>
              <option value="" disabled>
                Select a product
              </option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>

            <label>New Stock:</label>
            {inputElement}

            <Button type="submit" disabled={!canUpdateStock}>
              Update Stock
            </Button>
            {updateSuccess && <p className="mt-2">Updated successfully!</p>}
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Stock_Form;
