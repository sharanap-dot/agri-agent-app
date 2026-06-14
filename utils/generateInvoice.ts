import jsPDF from "jspdf";

export function generateInvoice(transaction: any) {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text(
    "SHREE MAHANTESHWARA TRADERS",
    20,
    20
  );

  doc.setFontSize(12);

  doc.text(
    `Date: ${new Date().toLocaleDateString()}`,
    20,
    35
  );

  doc.text(
    `Farmer: ${transaction.farmers?.name || "-"}`,
    20,
    50
  );

  doc.text(
    `Buyer: ${transaction.buyers?.name || "-"}`,
    20,
    60
  );

  doc.text(
    `Crop: ${transaction.crop_name}`,
    20,
    70
  );

  doc.text(
    `Quantity: ${transaction.quantity}`,
    20,
    80
  );

  doc.text(
    `Rate: ₹${transaction.rate}`,
    20,
    90
  );

  doc.text(
    `Total: ₹${transaction.total_amount}`,
    20,
    105
  );

  doc.text(
    `Commission: ₹${transaction.commission_amount}`,
    20,
    115
  );

  doc.text(
    `Net Amount: ₹${transaction.net_amount}`,
    20,
    125
  );

  doc.save(
    `invoice-${transaction.id}.pdf`
  );
}