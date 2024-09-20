import { useState } from "react";
import axios from "axios";

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "HR",
    gender: "M",
    course: [],
    image: null,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

    if (
      !formData.image ||
      !formData.email ||
      !formData.name ||
      !formData.mobile
    ) {
      setErrorMessage("All fields are required");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setErrorMessage("Invalid email format");
      return;
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      setErrorMessage("Mobile number should be 10 digits");
      return;
    }

    const formDataToSubmit = new FormData();
    for (let key in formData) {
      formDataToSubmit.append(key, formData[key]);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/employee",
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage("Employee created successfully!");
        setErrorMessage("");
      } else {
        setErrorMessage(response.data.message || "Error creating employee");
      }
    } catch (error) {
      setErrorMessage(error, "Error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-900">
    <div className="w-full max-w-md bg-indigo-600 rounded-xl shadow-lg py-6 px-8 max-h-full overflow-auto">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Create Employee
      </h2>
  
      {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
  
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {/* Name */}
        <div>
          <label className="block text-white mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full bg-gray-700 text-white border-0 rounded-md p-3 mb-1 focus:bg-gray-600 focus:outline-none transition ease-in-out duration-200 placeholder-gray-400"
            placeholder="Enter Name"
            required
          />
        </div>
  
        {/* Email */}
        <div>
          <label className="block text-white mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full bg-gray-700 text-white border-0 rounded-md p-3 mb-1 focus:bg-gray-600 focus:outline-none transition ease-in-out duration-200 placeholder-gray-400"
            placeholder="Enter Email"
            required
          />
        </div>
  
        {/* Mobile No */}
        <div>
          <label className="block text-white mb-1">Mobile No</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            className="w-full bg-gray-700 text-white border-0 rounded-md p-3 mb-1 focus:bg-gray-600 focus:outline-none transition ease-in-out duration-200 placeholder-gray-400"
            placeholder="Enter Mobile No"
            required
          />
        </div>
  
        {/* Designation */}
        <div>
          <label className="block text-white mb-1">Designation</label>
          <select
            name="designation"
            value={formData.designation}
            onChange={handleInputChange}
            className="w-full bg-gray-700 text-white border-0 rounded-md p-3 mb-1 focus:bg-gray-600 focus:outline-none transition ease-in-out duration-200"
          >
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
        </div>
  
        {/* Gender */}
        <div className="flex space-x-4 items-center">
          <label className="block text-white">Gender</label>
          <label className="text-white">
            <input
              type="radio"
              name="gender"
              value="M"
              checked={formData.gender === "M"}
              onChange={handleInputChange}
              className="form-radio text-indigo-500"
            />
            <span className="ml-2">M</span>
          </label>
          <label className="text-white">
            <input
              type="radio"
              name="gender"
              value="F"
              checked={formData.gender === "F"}
              onChange={handleInputChange}
              className="form-radio text-indigo-500"
            />
            <span className="ml-2">F</span>
          </label>
        </div>
  
        {/* Course */}
        <div className="flex space-x-4 items-center">
          <label className="block text-white">Course</label>
          <label className="text-white">
            <input
              type="checkbox"
              value="MCA"
              onChange={handleCheckboxChange}
              className="form-checkbox text-indigo-500"
            />
            <span className="ml-2">MCA</span>
          </label>
          <label className="text-white">
            <input
              type="checkbox"
              value="BCA"
              onChange={handleCheckboxChange}
              className="form-checkbox text-indigo-500"
            />
            <span className="ml-2">BCA</span>
          </label>
          <label className="text-white">
            <input
              type="checkbox"
              value="BSC"
              onChange={handleCheckboxChange}
              className="form-checkbox text-indigo-500"
            />
            <span className="ml-2">BSC</span>
          </label>
        </div>
  
        {/* Image Upload */}
        <div>
          <label className="block text-white mb-1">Image Upload</label>
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleFileChange}
            className="w-full bg-gray-700 text-white border-0 rounded-md p-3 mb-1 focus:bg-gray-600 focus:outline-none transition ease-in-out duration-200"
            required
          />
        </div>
  
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-500 text-gray-900 font-bold rounded-md p-3 mt-4 hover:bg-green-600 transition ease-in-out duration-200 focus:ring-4 focus:ring-green-300"
        >
          Submit
        </button>
      </form>
    </div>
  </div>
  
  
  );
};

export default EmployeeForm;

{
  /* <form className="flex flex-col">
            <div className="flex space-x-4 mb-4">
              <input placeholder="First Name"
                className="bg-gray-700 rounded-md p-2 w-1/2 focus:bg-gray-600 text-white border-0 focus: outline-none transition ease-in-out duration-150 placeholder-gray-300" type="text"
              />
         
            </div>
          </form> */
}
