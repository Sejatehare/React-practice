import jsPDF from "jspdf";

export function generateInvoice(order) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("INVOICE", 105, 15, { align: "center" });

  doc.setFontSize(12);
  doc.text(`Order ID: ${order.id}`, 10, 30);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 10, 38);
  doc.text(`Payment: ${order.paymentMethod}`, 10, 46);
  doc.text(`Status: ${order.status}`, 10, 54);

  let y = 70;
  doc.text("Items:", 10, y);
  y += 8;

  order.items.forEach((item, i) => {
    doc.text(
      `${i + 1}. ${item.name}  x${item.qty}  = ₹${item.price * item.qty}`,
      10,
      y
    );
    y += 8;
  });

  y += 10;
  doc.text(`Total Amount: ₹${order.totalAmount}`, 10, y);

  doc.save(`Invoice_${order.id}.pdf`);
}
