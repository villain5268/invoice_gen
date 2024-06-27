import React, { useState } from 'react';
import Invoice from './components/Invoice';
import UserInputForm from './components/UserInputForm';
import './components/styles.css'

const App = () => {
  const [invoiceData, setInvoiceData] = useState(null);

  const handleFormSubmit = (data) => {
    setInvoiceData(data);
  };

  return (
    <div>
      <UserInputForm onSubmit={handleFormSubmit} />
      {invoiceData && <Invoice data={invoiceData} />}
    </div>
  );
};

export default App;
