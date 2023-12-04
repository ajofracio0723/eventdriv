import React, { useState } from 'react';
import Sales_Chart from './Sales_Chart';
import Stock_Level_Chart from './Stock_Level_Chart';

const TransactionReport = ({ transactions, products }) => {
  const [sortByDate, setSortByDate] = useState(true);

  const sortedTransactions = transactions.slice().sort((a, b) => {
    if (sortByDate) {
      return new Date(b.date) - new Date(a.date); // Sort by newest date
    } else {
      return b.quantity - a.quantity; // Sort by transaction count
    }
  });

  const toggleSortByDate = () => {
    setSortByDate(!sortByDate);
  };

  return (
    <div>
      <button onClick={toggleSortByDate}>
        {sortByDate ? 'Sort by Transaction Count' : 'Sort by Date'}
      </button>
      {sortedTransactions.length > 0 ? (
        <div style={{ textAlign: 'center' }}>
          <table className='table' style={{ margin: 'auto' }}>
            <thead className='thead-dark'>
              <tr>
                <th>Product</th>
                <th>Amount</th>
                <th>Quantity</th>
                <th>Total amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.name}</td>
                  <td>₱{transaction.price.toLocaleString()}</td>
                  <td>{transaction.quantity}</td>
                  <td>₱{(transaction.quantity * transaction.price).toLocaleString()}</td>
                  <td>{new Date(transaction.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No transactions to display.</p>
      )}
      <br /><br />
      <Sales_Chart transactions={sortedTransactions} />
      <br />
      <Stock_Level_Chart products={products} />
    </div>
  );
};

export default TransactionReport;
