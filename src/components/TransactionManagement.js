import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { Container, Row, Col } from 'react-bootstrap';

const ProductCard = ({ product, addToCart }) => (
  <Col xs={12} sm={6} md={4} lg={3} className="mb-3" style={{ marginBottom: '20px' }}>
    <Card style={{ width: '12rem', height: '100%', border: '2px solid #ccc' }}>
      {product.image && (
        <Card.Img
          variant="top"
          src={product.image}
          alt={product.name}
          style={{ height: '100%', objectFit: 'contain' }}
        />
      )}
      <Card.Body style={{ border: '1px solid #ddd', borderTop: 'none' }}>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>
          <strong>Price:</strong> ₱{product.price.toLocaleString()}<br />
          <strong>Stock:</strong> {product.stock}
        </Card.Text>
        <button onClick={() => addToCart(product.id)}>Add to Cart</button>
      </Card.Body>
    </Card>
  </Col>
);




const TransactionManagement = ({ products = [], setProducts, onPaymentCompleted }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [cartId, setCartId] = useState(1);
  const [PaymentOptions, setPaymentOptions] = useState(false);
  const [PaymentMethod, setPaymentMethod] = useState('');
  const [CashOnDeliverySelected, setCashOnDeliverySelected] = useState(false);

  const [cashOnDeliveryDetails, setCashOnDeliveryDetails] = useState({
    fullName: '',
    CompleteAddress: '',
    contactNumber: '',
  });

  const availableProducts = products.filter((product) => product.stock > 0);

  const addToCart = (productId) => {
  const productToAdd = products.find((product) => product.id === productId);
  if (productToAdd && productToAdd.stock > 0) {
    const existingCartItem = cart.find((item) => item.id === productId);

    if (existingCartItem) {
      // If the product is already in the cart, just update the quantity
      const updatedCart = cart.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
    } else {
      // If the product is not in the cart, add it with quantity 1
      const updatedCart = [
        ...cart,
        {
          ...productToAdd,
          cartId: cartId,
          quantity: 1,
        },
      ];
      setCart(updatedCart);
    }

    // Update the product quantity in the products array by subtracting 1
    updateProductQuantity(productId, 1);

    setCartId(cartId + 1);
    updateTotal(cart);
  } else {
    alert('This product is out of stock.');
  }
};
  
  const removeFromCart = (cartIdToRemove) => {
    const updatedCart = cart.filter((product) => product.cartId !== cartIdToRemove);
    setCart(updatedCart);
    const removedProduct = cart.find((product) => product.cartId === cartIdToRemove);
    if (removedProduct) {
      // Update the product quantity in the products array by adding back the removed quantity
      updateProductQuantity(removedProduct.id, -removedProduct.quantity);
    }
  };

  const updateTotal = (updatedCart) => {
    const totalPrice = updatedCart.reduce(
      (acc, product) => acc + parseFloat(product.price) * product.quantity,
      0
    );
    setTotal(totalPrice);
  };

  const updateProductQuantity = (productId, quantityChange) => {
    const updatedProducts = products.map((product) =>
      product.id === productId
        ? { ...product, stock: Math.max(product.stock - quantityChange, 0) }
        : product
    );
  
    setProducts(updatedProducts);
  };
  const handleCheckout = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (cart.length === 0) {
      alert('Please add products to the cart before checking out!');
    } else {
      setPaymentOptions(true);
    }
  };

  useEffect(() => {
    updateTotal(cart);
  }, [cart]);

  const handlePaymentSelection = (paymentType) => {
    setPaymentOptions(true);
    setPaymentMethod(paymentType);
    setCashOnDeliverySelected(PaymentMethod === 'Cash on Delivery');

    if (paymentType === 'Pay Online') {
      printPurchaseDetailsOnline();
    }
  };

  const handleCashOnDeliverySubmit = (e) => {
    e.preventDefault();
    if (
      cashOnDeliveryDetails.fullName.trim() === '' ||
      cashOnDeliveryDetails.shippingAddress.trim() === '' ||
      cashOnDeliveryDetails.contactNumber.trim() === ''
    ) {
      alert('Please fill in all the required fields for Cash on Delivery.');
    } else {
      console.log('Cash on Delivery Details:', cashOnDeliveryDetails);
      printPurchaseDetails();
    }
  };

  const printPurchaseDetails = () => {
    const paymentDetails = `Payment Method: ${PaymentMethod}`;
    const additionalMessage = 'fsfhbsdbbfegeabchay this is a message';
    const printContent = document.getElementById('printContent');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(
        `<div>${printContent.innerHTML}</div><div>${paymentDetails}</div><div>${cashOnDeliveryDetails.fullName}</div><div>${cashOnDeliveryDetails.shippingAddress}</div><div>${cashOnDeliveryDetails.contactNumber}</div><div>${additionalMessage}</div>`
      );
      printWindow.document.close();
      printWindow.print();
    }
  };

  const printPurchaseDetailsOnline = () => {
    const paymentDetails = 'Online Payment';
    const additionalMessage = 'To confirm your payment, please send us your proof of payment via email at @gizmogliztfinance@gmail.com. Thank you for your purchased.';
    const printContent = document.getElementById('printContent');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(
        `<div>${printContent.innerHTML}</div><div>${paymentDetails}</div><div>${additionalMessage}</div>`
      );
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handlePaymentCompleted = () => {
    if (!PaymentMethod || PaymentMethod === '') {
      alert('Please select a payment method before completing the payment.');
      return;
    }
    if (CashOnDeliverySelected && !cashOnDeliveryDetails.fullName.trim()) {
      alert('Please provide your full name for Cash on Delivery.');
      return;
    }
    if (CashOnDeliverySelected && !cashOnDeliveryDetails.shippingAddress.trim()) {
      alert('Please provide your shipping address for Cash on Delivery.');
      return;
    }
    if (CashOnDeliverySelected && !cashOnDeliveryDetails.contactNumber.trim()) {
      alert('Please provide your contact number for Cash on Delivery.');
      return;
    }

    const updatedTransactions = cart.map((item) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      date: new Date().toISOString(),
    }));
  
    setTransactions([...transactions, ...updatedTransactions]);

    onPaymentCompleted(updatedTransactions);

    setCart([]);
    setTotal(0);
    setPaymentOptions(false);
    setPaymentMethod('');
    setCashOnDeliverySelected(false);
    setCashOnDeliveryDetails({
      fullName: '',
      shippingAddress: '',
      contactNumber: '',
    });
  };

  return (
    <div>
      <h4>Product Transaction (Point of Sale)</h4>
    
      <div>
        {PaymentOptions && (
          <div>
            <h3>Payment Options</h3>
            <p>Total: ₱{total.toLocaleString()}</p>
            <div>
              <h4>Choose Payment Method</h4>
              <button onClick={() => handlePaymentSelection('Cash on Delivery')}>Cash on Delivery</button>
              <button onClick={() => handlePaymentSelection('Pay Online')}>Pay Online</button>
              <button onClick={handlePaymentCompleted}>Complete Payment</button>
            </div>
          </div>
        )}
      </div>

      {CashOnDeliverySelected && (
        <div>
          <h3>Provide Details for Cash on Delivery</h3>
          <form onSubmit={handleCashOnDeliverySubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={cashOnDeliveryDetails.fullName}
              onChange={(e) =>
                setCashOnDeliveryDetails({ ...cashOnDeliveryDetails, fullName: e.target.value })
              }
              disabled={!CashOnDeliverySelected} // Disable the input if not selected
            />
            <input
              type="text"
              placeholder="Complete Address"
              value={cashOnDeliveryDetails.shippingAddress}
              onChange={(e) =>
                setCashOnDeliveryDetails({
                  ...cashOnDeliveryDetails,
                  shippingAddress: e.target.value
                })
              }
              disabled={!CashOnDeliverySelected} // Disable the input if not selected
            />
            <input
              type="number"
              placeholder="Contact Number"
              value={cashOnDeliveryDetails.contactNumber}
              onChange={(e) =>
                setCashOnDeliveryDetails({
                  ...cashOnDeliveryDetails,
                  contactNumber: e.target.value
                })
              }
              disabled={!CashOnDeliverySelected} // Disable the input if not selected
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}

<div id="printContent" style={{ display: 'none' }}>
        <h2>Purchase Receipt</h2>
        <p>Total: ₱{total.toLocaleString()}</p>
        <h3>Products Purchased:</h3>
        <Table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {cart.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>₱{product.price.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

          <div>
          <Container>
        <div style={{ marginBottom: '20px' }}>
          <h3>Products</h3>
          <Row style={{ margin: '0 -50px' }}>
          {availableProducts.map((product) => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
        </Row>
        </div>

  <div>
    <h5>Cart</h5>
    <table className='table'>
      <thead className='thead-dark'>
        <tr>
          <th>Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Image</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {cart.map((product) => (
          <tr key={product.id}>
            <td>{product.name}</td>
            <td>₱{product.price.toLocaleString()}</td>
            <td>{product.quantity}</td>
            <td>
              {/* Display the image */}
              {product.image && (
                <img
                  src={product.image} // Use the 'image' property directly
                  alt={product.name}
                  style={{ maxWidth: '100px', maxHeight: '100px' }}
                />
              )}
            </td>
            <td>
              <button onClick={() => removeFromCart(product.cartId)}>Remove</button>
              <button onClick={handleCheckout}>Checkout</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</Container>
      </div>
    </div>
  );
};

export default TransactionManagement;
