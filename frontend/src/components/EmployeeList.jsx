import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [totalCount, setTotalCount] = useState(0);

  const fetchEmployees = useCallback(async () => {
    const response = await axios.get("http://localhost:5000/api/employees", {
      params: { searchTerm, sortField, sortOrder },
    });
    setEmployees(response.data.employees);
    setTotalCount(response.data.totalCount);
  }, [searchTerm, sortField, sortOrder]);  // Dependencies here

  useEffect(() => {
    fetchEmployees(); // Fetch employees whenever dependencies change
  }, [fetchEmployees]);  // Pass fetchEmployees as a dependency

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      await axios.delete(`http://localhost:5000/api/employee/${id}`);
      fetchEmployees(); // Reload the list after delete
    }
  };

  return (
    <div>
      <h2>Employee List</h2>
      <input
        type="text"
        placeholder="Enter Search Keyword"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th onClick={() => setSortField("id")}>Unique ID</th>
            <th>Image</th>
            <th onClick={() => setSortField("name")}>Name</th>
            <th onClick={() => setSortField("email")}>Email</th>
            <th onClick={() => setSortField("mobile")}>Mobile No</th>
            <th>Designation</th>
            <th>Gender</th>
            <th>Course</th>
            <th onClick={() => setSortField("createdAt")}>Create Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee._id}</td>
              <td>
                <img src={`http://localhost:5000/uploads/${employee.image}`} alt="Employee" width="50" />
              </td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.mobile}</td>
              <td>{employee.designation}</td>
              <td>{employee.gender}</td>
              <td>{employee.course.join(", ")}</td>
              <td>{new Date(employee.createdAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => (window.location.href = `/edit-employee/${employee._id}`)}>Edit</button>
                <button onClick={() => handleDelete(employee._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Total Count: {totalCount}</p>
    </div>
  );
};

export default EmployeeList;
