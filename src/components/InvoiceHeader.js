import React from 'react';
import './styles.css'

const InvoiceHeader = ({ data }) => (
  <div>
    <h1>Tax Invoice/Bill of Supply/Cash Memo</h1>
    <p>(Original for Recipient)</p>
    <p>Order Number: {data.orderNumber}</p>
    <p>Invoice Number: {data.invoiceNumber}</p>
    <p>Order Date: {data.orderDate}</p>
    <p>Invoice Details: {data.invoiceDetails}</p>
    <p>Invoice Date: {data.invoiceDate}</p>
    <p>Sold By: {data.seller.name}</p>
    <p>Address: {data.seller.address}, {data.seller.city}, {data.seller.state} - {data.seller.pincode}</p>
    <p>PAN No: {data.seller.pan}</p>
    <p>GST Registration No: {data.seller.gst}</p>
  </div>
);

export default InvoiceHeader;
