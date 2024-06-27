import React from 'react';
import './styles.css'
import currencyFormatter from 'currency-formatter';

const InvoiceFooter = ({ data }) => {
  const totalTax = data.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity - item.discount) * (data.taxRate / 100), 0);
  const totalAmount = data.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity - item.discount) + ((item.unitPrice * item.quantity - item.discount) * (data.taxRate / 100)), 0);

  const amountInWords = (amount) => {
    
    const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const teens = ["", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const thousands = ["", "Thousand", "Million", "Billion"];

    if (amount === 0) return "Zero";

    const words = [];

    let unit = 0;

    while (amount > 0) {
      let part = amount % 1000;

      if (part > 0) {
        const hundreds = Math.floor(part / 100);
        part %= 100;

        const tensAndUnits = part;

        const tensPart = Math.floor(tensAndUnits / 10);
        const unitsPart = tensAndUnits % 10;

        let partWords = [];

        if (hundreds > 0) {
          partWords.push(units[hundreds] + " Hundred");
        }

        if (tensPart > 1) {
          partWords.push(tens[tensPart]);
          partWords.push(units[unitsPart]);
        } else if (tensPart === 1) {
          partWords.push(teens[unitsPart]);
        } else {
          partWords.push(units[unitsPart]);
        }

        words.push(partWords.join(" ") + " " + thousands[unit]);
      }

      amount = Math.floor(amount / 1000);
      unit++;
    }

    return words.reverse().join(" ");
  };

  return (
    <div>
      <p>Total Tax Amount: {currencyFormatter.format(totalTax, { code: 'INR' })}</p>
      <p>Total Amount: {currencyFormatter.format(totalAmount, { code: 'INR' })}</p>
      <p>Amount in Words: {amountInWords(totalAmount)}</p>
      <p>For {data.seller.name}: <img src={data.signature} alt="Signature" style={{ width: '100px', height: '50px' }} /></p>
      <p>Authorised Signatory</p>
    </div>
  );
};

export default InvoiceFooter;
