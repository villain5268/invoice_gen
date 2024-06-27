import React, { useState } from 'react';
import './styles.css';

const UserInputForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    seller: { name: '', address: '', city: '', state: '', pincode: '', pan: '', gst: '' },
    placeOfSupply: '',
    billingDetails: { name: '', address: '', city: '', state: '', pincode: '', stateCode: '' },
    shippingDetails: { name: '', address: '', city: '', state: '', pincode: '', stateCode: '' },
    placeOfDelivery: '',
    orderNumber: '',
    orderDate: '',
    invoiceNumber: '',
    invoiceDetails: '',
    invoiceDate: '',
    reverseCharge: 'No',
    items: [{ description: '', unitPrice: 0, quantity: 1, discount: 0 }],
    taxRate: 18,
    taxType: 'IGST',
    signature: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('items[')) {
      
      const [, index, field] = name.match(/\[(\d+)\]\.(.*)/);
      const updatedItems = [...formData.items];
      updatedItems[index][field] = value;
      setFormData({ ...formData, items: updatedItems });
    } else if (name.startsWith('seller.')) {
      
      const sellerField = name.split('.')[1];
      setFormData({ ...formData, seller: { ...formData.seller, [sellerField]: value } });
    } else {
      
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddItem = () => {
    setFormData({ ...formData, items: [...formData.items, { description: '', unitPrice: 0, quantity: 1, discount: 0 }] });
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, signature: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Seller Details</h2>
      <input name="seller.name" placeholder="Name" value={formData.seller.name} onChange={handleChange} />
      <input name="seller.address" placeholder="Address" value={formData.seller.address} onChange={handleChange} />
      <input name="seller.city" placeholder="City" value={formData.seller.city} onChange={handleChange} />
      <input name="seller.state" placeholder="State" value={formData.seller.state} onChange={handleChange} />
      <input name="seller.pincode" placeholder="Pincode" value={formData.seller.pincode} onChange={handleChange} />
      <input name="seller.pan" placeholder="PAN No." value={formData.seller.pan} onChange={handleChange} />
      <input name="seller.gst" placeholder="GST Registration No." value={formData.seller.gst} onChange={handleChange} />

      <h2>Order Details</h2>
      <input name="orderNumber" placeholder="Order Number" value={formData.orderNumber} onChange={handleChange} />
      <input name="orderDate" placeholder="Order Date" value={formData.orderDate} onChange={handleChange} />

      <h2>Invoice Details</h2>
      <input name="invoiceNumber" placeholder="Invoice Number" value={formData.invoiceNumber} onChange={handleChange} />
      <input name="invoiceDetails" placeholder="Invoice Details" value={formData.invoiceDetails} onChange={handleChange} />
      <input name="invoiceDate" placeholder="Invoice Date" value={formData.invoiceDate} onChange={handleChange} />
      <select name="reverseCharge" value={formData.reverseCharge} onChange={handleChange}>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>

      <h2>Item Details</h2>
      {formData.items.map((item, index) => (
        <div key={index}>
          <input name={`items[${index}].description`} placeholder="Description" value={item.description} onChange={handleChange} />
          <input name={`items[${index}].unitPrice`} type="number" placeholder="Unit Price" value={item.unitPrice} onChange={handleChange} />
          <input name={`items[${index}].quantity`} type="number" placeholder="Quantity" value={item.quantity} onChange={handleChange} />
          <input name={`items[${index}].discount`} type="number" placeholder="Discount" value={item.discount} onChange={handleChange} />
        </div>
      ))}
      <button type="button" onClick={handleAddItem}>Add Item</button>

      <h2>Tax Rate</h2>
      <input name="taxRate" type="number" placeholder="Tax Rate" value={formData.taxRate} onChange={handleChange} />

      <h2>Signature</h2>
      <input type="file" onChange={handleSignatureUpload} />

      <button type="submit">Generate Invoice</button>
    </form>
  );
};

export default UserInputForm;
