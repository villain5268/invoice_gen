import React from 'react';
import InvoiceHeader from './InvoiceHeader';
import InvoiceTable from './InvoiceTable';
import InvoiceFooter from './InvoiceFooter';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import currencyFormatter from 'currency-formatter';
import './styles.css';
import companyLogo from './logo192.png';
import signatureImg from './signature.jpg'; // Adjust path to your signature image

const Invoice = ({ data }) => {
  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait', // Adjust orientation as needed
      unit: 'mm', // Use millimeters as the unit for size
      format: 'a4', // Specify the page format
    });

    doc.setFont('Roboto', 'normal');
    doc.setFontSize(10); 
  
    const margin = 15;
    const padding = 15;
  
    const logoImg = new Image();
    logoImg.src = companyLogo;
    
    // Ensure the logo is loaded before adding to the PDF
    logoImg.onload = function() {
      doc.addImage(logoImg, 'PNG', margin, padding, 30, 15); // Adjust dimensions as needed

      // Add signature image
      const signature = new Image();
      signature.src = signatureImg;
      signature.onload = function() {
        // Adjust the position and size of the signature image as needed
        doc.addImage(signature, 'PNG', margin, doc.internal.pageSize.height - 40, 40, 20);
        
        doc.setFontSize(14); 
        doc.setTextColor(0, 102, 204); 
        doc.text("Tax Invoice/Bill of Supply/Cash Memo", margin, padding + 25);
        doc.setTextColor(66, 66, 66); 
        doc.setFontSize(10);
        doc.text(`Order Number: ${data.orderNumber}`, margin, padding + 35);
        doc.text(`Invoice Number: ${data.invoiceNumber}`, margin, padding + 45);
        doc.text(`Order Date: ${data.orderDate}`, margin, padding + 55);
        doc.text(`Invoice Date: ${data.invoiceDate}`, margin, padding + 65);
      
        doc.text(`Sold By: ${data.seller.name}`, margin, padding + 75);
        doc.text(`Address: ${data.seller.address}, ${data.seller.city}, ${data.seller.state} - ${data.seller.pincode}`, margin, padding + 85);
        doc.text(`PAN No: ${data.seller.pan}`, margin, padding + 95);
        doc.text(`GST Registration No: ${data.seller.gst}`, margin, padding + 105);
      
        let startY = padding + 115;
        doc.autoTable({
          startY,
          head: [['Sl. No', 'Description', 'Unit Price', 'Qty', 'Net Amount', 'Tax Rate', 'Tax Type', 'Tax Amount', 'Total Amount']],
          body: data.items.map((item, index) => [
            index + 1,
            item.description,
            currencyFormatter.format(item.unitPrice, { code: 'INR' }),
            item.quantity,
            currencyFormatter.format((item.unitPrice * item.quantity - item.discount), { code: 'INR' }),
            `${data.taxRate}%`,
            data.taxType,
            currencyFormatter.format((item.unitPrice * item.quantity - item.discount) * (data.taxRate / 100), { code: 'INR' }),
            currencyFormatter.format(item.unitPrice * item.quantity, { code: 'INR' })
          ]),
          theme: 'striped', 
          styles: {
            textColor: [66, 66, 66], 
            lineWidth: 0.1,
            fontSize: 8, 
            cellPadding: 4,
            valign: 'middle'
          },
          columnStyles: {
            0: { cellWidth: 10 }, 
            1: { cellWidth: 50 },
            2: { cellWidth: 20 },
            3: { cellWidth: 15 },
            4: { cellWidth: 20 },
            5: { cellWidth: 15 },
            6: { cellWidth: 15 },
            7: { cellWidth: 20 },
            8: { cellWidth: 25 }
          }
        });
      
        const totalTax = data.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity - item.discount) * (data.taxRate / 100), 0);
        const totalAmount = data.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
      
        startY = doc.autoTable.previous.finalY + 10;
        doc.setFontSize(10);
        doc.text(`Total Tax Amount: ${currencyFormatter.format(totalTax, { code: 'INR' })}`, margin, startY);
        doc.text(`Total Amount: ${currencyFormatter.format(totalAmount, { code: 'INR' })}`, margin, startY + 10);
        doc.text(`Amount in Words: ${amountInWords(totalAmount)}`, margin, startY + 20);
      
        const footerY = doc.internal.pageSize.height - 10;
        doc.setFontSize(8); 
        doc.text('Thank you for your business!', margin, footerY);
        doc.text(`Contact us: ${data.seller.email}`, margin, footerY + 5);
      
        doc.save('invoice.pdf');
      };
    };
  };

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
    <div className="invoice-container">
      <InvoiceHeader data={data} />
      <InvoiceTable data={data} />
      <InvoiceFooter data={data} />
      <button className="invoice-pdf-button" onClick={generatePDF}>Download PDF</button>
    </div>
  );
};

export default Invoice;
