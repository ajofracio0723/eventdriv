import React, { useState } from 'react';

const TransactionReport = ({ transactions }) => {
  const [sortByCount, setSortByCount] = useState(false);

  const sortedTransactions = sortByCount
    ? transactions.slice().sort((a, b) => b.quantity - a.quantity)
    : transactions;

  const toggleSortByCount = () => {
    setSortByCount(!sortByCount);
  };

  return (
    <div>
      <button onClick={toggleSortByCount}>
        {sortByCount ? 'Sort by Date' : 'Sort by Transaction Count'}
      </button>
      {sortedTransactions.length > 0 ? (
        <table className='table'>
          <thead className='thead-dark'>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Date</th>
              <th>Image</th>
              
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.name}</td>
                <td>₱{transaction.price}</td>
                <td>{transaction.quantity}</td>
                <td>{new Date(transaction.date).toLocaleString()}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No transactions to display.</p>
      )}
    </div>
  );
};

export default TransactionReport;
