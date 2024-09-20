import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import EmployeeForm from "./components/EmployeeForm";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/addEmployee" element={<EmployeeForm />} />
      </Routes>
    </Router>
  );
};

export default App;
