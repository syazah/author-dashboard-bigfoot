import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full p-4">
      <div className="w-full">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <button
          onClick={() => {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("completed");
            navigate("/");
          }}
          className="bg-red-800 px-4 py-2 rounded-full text-white hover:bg-red-900"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Settings;
