import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EmployeeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "",
    gender: "",
    course: [],
    image: null,
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchEmployee();
  });

  const fetchEmployee = async () => {
    const response = await axios.get(`http://localhost:5000/api/employee/${id}`);
    const employee = response.data;
    setFormData({
      name: employee.name,
      email: employee.email,
      mobile: employee.mobile,
      designation: employee.designation,
      gender: employee.gender,
      course: employee.course,
      image: employee.image, // Preload image for preview
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        course: [...formData.course, value],
      });
    } else {
      setFormData({
        ...formData,
        course: formData.course.filter((c) => c !== value),
      });
    }
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image || !formData.email || !formData.name || !formData.mobile) {
      setErrorMessage("All fields are required");
      return;
    }

    const formDataToSubmit = new FormData();
    for (let key in formData) {
      formDataToSubmit.append(key, formData[key]);
    }

    try {
      await axios.put(`http://localhost:5000/api/employee/${id}`, formDataToSubmit, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/employee-list");
    } catch (error) {
      setErrorMessage(error,"Error updating employee");
    }
  };

  return (
    <div>
      <h2>Edit Employee</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Mobile No</label>
          <input type="text" name="mobile" value={formData.mobile} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Designation</label>
          <select name="designation" value={formData.designation} onChange={handleInputChange}>
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
        </div>
        <div>
          <label>Gender</label>
          <label>
            <input type="radio" name="gender" value="M" checked={formData.gender === "M"} onChange={handleInputChange} /> M
          </label>
          <label>
            <input type="radio" name="gender" value="F" checked={formData.gender === "F"} onChange={handleInputChange} /> F
          </label>
        </div>
        <div>
          <label>Course</label>
          <label>
            <input type="checkbox" value="MCA" onChange={handleCheckboxChange} checked={formData.course.includes("MCA")} /> MCA
          </label>
          <label>
            <input type="checkbox" value="BCA" onChange={handleCheckboxChange} checked={formData.course.includes("BCA")} /> BCA
          </label>
          <label>
            <input type="checkbox" value="BSC" onChange={handleCheckboxChange} checked={formData.course.includes("BSC")} /> BSC
          </label>
        </div>
        <div>
          <label>Image Upload</label>
          <input type="file" accept="image/jpeg, image/png" onChange={handleFileChange} />
          {formData.image && <img src={`http://localhost:5000/uploads/${formData.image}`} alt="Employee" width="50" />}
        </div>

        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EmployeeEdit;
