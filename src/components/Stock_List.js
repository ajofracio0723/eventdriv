import React from 'react';
import iphone15 from './images/iphone15.jpg'


const Stock_List = ({ products }) => {
  return (
    <div>
      <h2>Stock List</h2>
      <table class='table'>
        <thead class='thead-dark'>
          <tr>
            <th>Product</th>
            <th>Stock</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.stock}</td>
              <td>
                      {/* Display the image */}
                      {product.image && (
                        <img
                          src={iphone15}  // Use the 'iphone15' variable directly
                          alt={product.name}
                          style={{ maxWidth: '100px', maxHeight: '100px' }}
                        />
                      )}
                    </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
  );
};

export default Stock_List;