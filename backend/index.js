const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/Employee", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const EmployeeList = mongoose.model("EmployeeList", UserSchema);

// API to login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await EmployeeList.findOne({ username });

  if (user && bcrypt.compareSync(password, user.password)) {
    return res.json({ success: true });
  }

  return res.json({ success: false });
});

// API to register user (for testing purpose)
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const newEmployee = new EmployeeList({ username, password: hashedPassword });
  await newEmployee.save();

  res.json({ success: true });
});


/* Employee creation code */

const multer = require("multer");

const employeeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: employeeStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Only JPG/PNG images are allowed"), false);
    }
  },
});

const EmployeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  designation: String,
  gender: String,
  course: [String],
  image: String,
});

const Employee = mongoose.model("Employee", EmployeeSchema);

app.post("/api/employee", upload.single("image"), async (req, res) => {
  const { name, email, mobile, designation, gender, course } = req.body;

  if (!name || !email || !mobile || !designation || !gender || !course) {
    return res.json({ success: false, message: "All fields are required" });
  }

  const existingEmployee = await Employee.findOne({ email });
  if (existingEmployee) {
    return res.json({ success: false, message: "Email already exists" });
  }

  const newEmployee = new Employee({
    name,
    email,
    mobile,
    designation,
    gender,
    course: JSON.parse(course),
    image: req.file.filename,
  });

  await newEmployee.save();

  res.json({ success: true });
});

app.get("/api/employees", async (req, res) => {
  const { searchTerm, sortField = "name", sortOrder = "asc" } = req.query;
  const query = {};

  if (searchTerm) {
    query.$or = [
      { name: { $regex: searchTerm, $options: "i" } },
      { email: { $regex: searchTerm, $options: "i" } },
    ];
  }

  const employees = await Employee.find(query)
    .sort({ [sortField]: sortOrder === "asc" ? 1 : -1 })
    .exec();

  const totalCount = await Employee.countDocuments(query);
  res.json({ employees, totalCount });
});

app.put("/api/employee/:id", upload.single("image"), async (req, res) => {
  const { name, email, mobile, designation, gender, course } = req.body;
  const employeeId = req.params.id;
  const employee = await Employee.findById(employeeId);

  employee.name = name;
  employee.email = email;
  employee.mobile = mobile;
  employee.designation = designation;
  employee.gender = gender;
  employee.course = course;

  if (req.file) {
    employee.image = req.file.filename;
  }

  await employee.save();
  res.json({ message: "Employee updated successfully" });
});

app.delete("/api/employee/:id", async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ message: "Employee deleted successfully" });
});



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
