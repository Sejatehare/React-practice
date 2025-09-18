import React from "react";
import { useSelector } from "react-redux";

const DownloadCSVButton = () => {
  const expenses = useSelector((state) => state.expense.items);

  const downloadCSV = () => {
    if (!expenses.length) {
      alert("No expenses to download");
      return;
    }

    const header = ["MoneySpent", "Description", "Category"];
    const rows = expenses.map(({ moneySpent, description, category }) =>
      [moneySpent, description, category].join(",")
    );

    const csvContent = [header.join(","), ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return <button onClick={downloadCSV}>Download Expenses CSV</button>;
};

export default DownloadCSVButton;
