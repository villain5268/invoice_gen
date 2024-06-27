import React from 'react';
import currencyFormatter from 'currency-formatter';
import './styles.css'

const InvoiceTable = ({ data }) => {
  const calculateNetAmount = (item) => item.unitPrice * item.quantity - item.discount;
  const calculateTaxAmount = (item, taxRate) => calculateNetAmount(item) * (taxRate / 100);

  return (
    <table>
      <thead>
        <tr>
          <th>Sl. No</th>
          <th>Description</th>
          <th>Unit Price</th>
          <th>Qty</th>
          <th>Net Amount</th>
          <th>Tax Rate</th>
          <th>Tax Type</th>
          <th>Tax Amount</th>
          <th>Total Amount</th>
        </tr>
      </thead>
      <tbody>
        {data.items.map((item, index) => {
          const netAmount = calculateNetAmount(item);
          const taxAmount = calculateTaxAmount(item, data.taxRate);
          const totalAmount = netAmount + taxAmount;

          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.description}</td>
              <td>{currencyFormatter.format(item.unitPrice, { code: 'INR' })}</td>
              <td>{item.quantity}</td>
              <td>{currencyFormatter.format(netAmount, { code: 'INR' })}</td>
              <td>{data.taxRate}%</td>
              <td>{data.taxType}</td>
              <td>{currencyFormatter.format(taxAmount, { code: 'INR' })}</td>
              <td>{currencyFormatter.format(totalAmount, { code: 'INR' })}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default InvoiceTable;
