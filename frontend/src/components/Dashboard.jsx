import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const Dashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!username) {
      navigate("/login");
    }
  }, [username, navigate]);

  return (
    <div>
      <nav className="flex bg-indigo-500 text-2xl justify-between p-3 font-serif">
        <p>Home</p>
        <p>EmployeeList</p>
        <p>{username}</p>
        <button
          onClick={() => {
            localStorage.removeItem("username");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </nav>
      <h2>Welcome Admin Panel</h2>
    </div>
  );
};

export default Dashboard;
