import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateBuyerStatement(
  buyer: any,
  transactions: any[],
  payments: any[]
) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(
    "SHREE MAHANTESHWARA TRADERS",
    14,
    20
  );

  doc.setFontSize(12);

  doc.text(
    "Buyer Statement",
    14,
    30
  );

  doc.text(
    `Buyer: ${buyer.name}`,
    14,
    40
  );

  doc.text(
    `Phone: ${buyer.phone || "-"}`,
    14,
    48
  );

  doc.text(
    `Address: ${buyer.address || "-"}`,
    14,
    56
  );

  autoTable(doc, {
    startY: 70,

    head: [[
      "Farmer",
      "Crop",
      "Qty",
      "Amount",
    ]],

    body: transactions.map((t) => [
      t.farmers?.name || "-",
      t.crop_name,
      t.quantity,
      t.total_amount,
    ]),
  });

  const finalY =
    (doc as any).lastAutoTable.finalY + 15;

  doc.text(
    `Payments Received: ₹${payments.reduce(
      (s, p) => s + Number(p.amount || 0),
      0
    )}`,
    14,
    finalY
  );

  doc.save(
    `${buyer.name}-statement.pdf`
  );
}