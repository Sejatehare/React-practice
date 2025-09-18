import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import { saveAs } from "file-saver";

const ProfileView = () => {
  const user = useSelector((state) => state.user);
  const email = useSelector((state) => state.auth.email);
  const isPremium = useSelector((state) => state.auth.isPremium);
  const expenses = useSelector((state) => state.expense.items);
  const navigate = useNavigate();

  const downloadCSV = () => {
    const csv = Papa.unparse(expenses);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "expenses.csv");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
      <p><strong>Name:</strong> {user?.name}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Mobile:</strong> {user?.mobile}</p>
      <p><strong>Password:</strong> ********</p>
      
      {isPremium && (
        <button
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
          onClick={downloadCSV}
        >
          Download Expenses
        </button>
      )}

      <button
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded ml-4"
        onClick={() => navigate("/dashboard")}
      >
        Cancel
      </button>
    </div>
  );
};

export default ProfileView;
