import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 text-white">
      <h2 className="text-5xl font-extrabold mb-6">Welcome to your mail box</h2>
      <button
        onClick={handleLogout}
        className="px-6 py-3 bg-white text-green-500 font-bold rounded-full shadow-lg hover:bg-gray-100 transition"
      >
        Logout
      </button>
    </div>
  );
}
