import React, { useState, useEffect } from 'react';
import { Button, Table, Modal } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { Container, Row, Col, Tab, Nav } from 'react-bootstrap';
import MyImage from './images/success.gif'

const ProductCard = ({ product, addToCart }) => (
  <Col xs={12} sm={6} md={4} lg={3} className="mb-3" style={{ marginBottom: '20px' }}>
    <Card style={{ width: '18rem', height: '100%', border: '2px solid #ccc' }}>
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
        <Button variant='primary' onClick={() => addToCart(product.id)}>Add to Cart</Button>
      </Card.Body>
    </Card>
  </Col>
);

const PaymentOptionsContainer = ({ children }) => (
  <div className="payment-options-container" style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '20px' }}>
    {children}
  </div>
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
    shippingAddress: '',
    contactNumber: '',
  });

  const [showCashOnDeliveryModal, setShowCashOnDeliveryModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [selectedTab, setSelectedTab] = useState("products");

  const availableProducts = products.filter((product) => product.stock > 0);

  const addToCart = (productId) => {
    const productToAdd = products.find((product) => product.id === productId);
    if (productToAdd && productToAdd.stock > 0) {
      const existingCartItem = cart.find((item) => item.id === productId);

      if (existingCartItem) {
        const updatedCart = cart.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        setCart(updatedCart);
      } else {
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
    e.preventDefault();
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
    setCashOnDeliverySelected(paymentType === 'Cash on Delivery');

    if (paymentType === 'Pay Online') {
      printPurchaseDetailsOnline();
    }

    setCashOnDeliveryDetails({
      fullName: '',
      shippingAddress: '',
      contactNumber: '',
    });

    if (paymentType === 'Cash on Delivery') {
      setShowCashOnDeliveryModal(true);
    } else {
      setShowCashOnDeliveryModal(false);
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
      printPurchaseDetails();
      setShowCashOnDeliveryModal(false);
    }
  };

  const printPurchaseDetails = () => {
    const paymentDetails = `Payment Method: ${PaymentMethod}`;
    const additionalMessage =
      ' Please ensure that someone is available at the provided address to receive the delivery. Our delivery team will contact you shortly to confirm the delivery schedule.';
    const printContent = document.getElementById('printContent');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <div style="display: flex; align-items: center; justify-content: center;  margin: 0;">
          <div style="text-align: center;">
            <div>${printContent.innerHTML}</div>
            <div>${paymentDetails}</div>
            <div>${cashOnDeliveryDetails.fullName}</div>
            <div>${cashOnDeliveryDetails.shippingAddress}</div>
            <div>${cashOnDeliveryDetails.contactNumber}</div>
            <div>${additionalMessage}</div>
          </div>
        </div>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };
  

  const printPurchaseDetailsOnline = () => {
  const paymentDetails = 'Online Payment';
  const additionalMessage =
    'To confirm your payment, please send us your proof of payment via email at @gizmogliztfinance@gmail.com. Thank you for your purchased.';
  const printContent = document.getElementById('printContent');
  if (printContent) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <div style="text-align: center;">${printContent.innerHTML}</div>
      <div style="text-align: center; margin-top: 10px;">${paymentDetails}</div>
      <div style="text-align: center;">${additionalMessage}</div>
    `);
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
  
    setShowCashOnDeliveryModal(false);
  
    // Open the Payment Modal
    setShowPaymentModal(true);
};

  return (
    <Container>
      <Tab.Container id="tabs" defaultActiveKey="products" activeKey={selectedTab} onSelect={setSelectedTab}>
        <Row>
          <Col>
            <Nav variant="tabs" className="mb-3" style={{ fontSize: '20px', padding: '10px' }}>
              <Nav.Item>
                <Nav.Link eventKey="products">Products</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="cart">Cart</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="products">
                <div style={{ marginBottom: '20px' }}>
                  <h1>Products</h1>
                  <Row style={{ margin: '0 -50px' }}>
                    {availableProducts.map((product) => (
                      <ProductCard key={product.id} product={product} addToCart={addToCart} />
                    ))}
                  </Row>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="cart">
                <div>
                  <h1>Cart</h1>
                  <table className='table' style={{ margin: 'auto', textAlign: 'center'}}>
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
                            {product.image && (
                              <img
                                src={product.image}
                                alt={product.name}
                                style={{ maxWidth: '100px', maxHeight: '100px' }}
                              />
                            )}
                          </td>
                          <td>
                            <Button variant='danger' onClick={() => removeFromCart(product.cartId)}>Remove</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {cart.length > 0 && (
                    <div>
                      <div style={{ textAlign: 'center' }}> <br></br>
                        <Button variant='success' onClick={handleCheckout}>
                          Checkout
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>

      <div>
        <div>
          {PaymentOptions && selectedTab === "cart" && (
            <PaymentOptionsContainer>
              <h4>Product Transaction (Point of Sale)</h4>
              <p>Total: ₱{total.toLocaleString()}</p>
              <div>
                <h4>Choose Payment Method</h4>
                <Button variant='success' onClick={() => handlePaymentSelection('Cash on Delivery')}>
                  Cash on Delivery
                </Button>&nbsp;
                <Button variant='success' onClick={() => handlePaymentSelection('Pay Online')}>
                  Pay Online
                </Button> &nbsp;
                <Button variant='success' onClick={handlePaymentCompleted}>Complete Payment</Button>
              </div>
            </PaymentOptionsContainer>
          )}
        </div>

        {/* Payment Modal */}
        <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Payment Successful</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Your payment has been successfully completed!</p>
            <img src={MyImage} alt="Payment Successful img" style={{ maxWidth: '100%', height: 'auto' }} />
            
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showCashOnDeliveryModal} onHide={() => setShowCashOnDeliveryModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Cash on Delivery Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleCashOnDeliverySubmit}>
              <input
                type="text"
                placeholder="Full Name"
                value={cashOnDeliveryDetails.fullName}
                onChange={(e) =>
                  setCashOnDeliveryDetails({ ...cashOnDeliveryDetails, fullName: e.target.value })
                }
                disabled={!CashOnDeliverySelected} 
              />&nbsp;
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
                disabled={!CashOnDeliverySelected}
              />&nbsp;
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
                disabled={!CashOnDeliverySelected}
              />&nbsp;
              <Button variant="success" type="submit">
                Submit
              </Button>
            </form>
          </Modal.Body>
        </Modal>

            
        <div id="printContent" style={{ display: 'none' }}>
  <h2 style={{ textAlign: 'center', borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>
    Purchase Receipt
  </h2>
  <p style={{ textAlign: 'center' }}>Total: ₱{total.toLocaleString()}</p>
  <h3 style={{ textAlign: 'center', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>Products Purchased:</h3>
  <Table style={{ width: '80%', margin: 'auto', marginBottom: '40px', borderCollapse: 'collapse' }}>
    <thead>
      <tr>
        <th style={{ border: '1px solid #ccc', padding: '23px', textAlign: 'center', backgroundColor: '#f2f2f2' }}>Product</th>
        <th style={{ border: '1px solid #ccc', padding: '23px', textAlign: 'center', backgroundColor: '#f2f2f2' }}>Quantity</th>
        <th style={{ border: '1px solid #ccc', padding: '23px', textAlign: 'center', backgroundColor: '#f2f2f2' }}>Price</th>
      </tr>
    </thead>
    <tbody>
      {cart.map(product => (
        <tr key={product.id}>
          <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{product.name}</td>
          <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{product.quantity}</td>
          <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
            ₱{product.price.toLocaleString()}
          </td>
        </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </Container>
  );
};

export default TransactionManagement;
