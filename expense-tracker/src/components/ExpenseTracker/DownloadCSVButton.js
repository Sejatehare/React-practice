import React from "react";
import { useSelector } from "react-redux";

const DownloadCSVButton = () => {
  const items = useSelector((s) => s.expense.items);
  const download = () => {
    const header = "Money,Description,Category";
    const rows = items.map((e) => `${e.moneySpent},${e.description},${e.category}`);
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "expenses.csv";
    a.click();
  };
  return <button onClick={download}>Download CSV</button>;
};

export default DownloadCSVButton;
