import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateFarmerStatement(
  farmer: any,
  transactions: any[]
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
    "Farmer Statement",
    14,
    30
  );

  doc.text(
    `Farmer: ${farmer.name}`,
    14,
    40
  );

  doc.text(
    `Village: ${farmer.village || "-"}`,
    14,
    48
  );

  doc.text(
    `Phone: ${farmer.phone || "-"}`,
    14,
    56
  );

  autoTable(doc, {
    startY: 65,

    head: [[
      "Crop",
      "Qty",
      "Rate",
      "Total",
      "Commission",
      "Net",
    ]],

    body: transactions.map((t) => [
      t.crop_name,
      t.quantity,
      t.rate,
      t.total_amount,
      t.commission_amount,
      t.net_amount,
    ]),
  });

  doc.save(
    `${farmer.name}-statement.pdf`
  );
}