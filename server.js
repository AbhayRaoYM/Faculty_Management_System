const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1by23cs003#",
  database: "trial"
});

db.connect(err => {
  if (err) console.error("DB error:", err);
  else console.log("MySQL Connected!");
});

// API Endpoint
app.post("/api/faculty", (req, res) => {
  const { name, gender, dob, phone, designation, departmentid } = req.body;
  const sql = `INSERT INTO faculty (Name, Gender, DOB, Phone, Designation, DepartmentID) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(sql, [name, gender, dob, phone, designation, departmentid], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("DB Insert Error");
    }
    res.status(200).send("Faculty added");
  });
});

app.get("/api/faculty", (req, res) => {
  db.query("SELECT * FROM faculty", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Failed to fetch faculty");
    }
    res.json(results);
  });
});

app.delete("/api/faculty/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM faculty WHERE FacultyID = ?", [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Delete failed");
    }
    res.send("Deleted");
  });
});

app.put("/api/faculty/:id", (req, res) => {
  const { id } = req.params;
  const { name, phone, designation } = req.body;

  const sql = "UPDATE faculty SET Name = ?, Phone = ?, Designation = ? WHERE FacultyID = ?";
  db.query(sql, [name, phone, designation, id], (err, result) => {
    if (err) {
      console.error("Update error:", err);
      return res.status(500).send("Update failed");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Faculty not found");
    }

    res.send("Updated successfully");
  });
});



// Add Department
app.post("/api/department", (req, res) => {
  const { departName } = req.body;
  db.query("INSERT INTO department (DepartName) VALUES (?)", [departName], (err, result) => {
    if (err) return res.status(500).send("Error adding department");
    res.send("Department added");
  });
});

// Add Subject
app.post("/api/subject", (req, res) => {
  const { subName, departID } = req.body;
  db.query("INSERT INTO Subject (SubName, DepartID) VALUES (?, ?)", [subName, departID], (err, result) => {
    if (err) return res.status(500).send("Error adding subject");
    res.send("Subject added");
  });
});

// Assign Faculty to Subject
app.post("/api/facultysubject", (req, res) => {
  const { facultyID, subID, semester, academicYear } = req.body;
  db.query(
    "INSERT INTO FacultySubject (FacultyID, SubID, Semester, AcademicYear) VALUES (?, ?, ?, ?)",
    [facultyID, subID, semester, academicYear],
    (err, result) => {
      if (err) return res.status(500).send("Error assigning faculty to subject");
      res.send("Assignment added");
    }
  );
});

app.get("/api/department", (req, res) => {
  db.query("SELECT * FROM department", (err, results) => {
    if (err) {
      console.error("Error fetching departments:", err);
      res.status(500).send("Error retrieving department list");
    } else {
      res.json(results);
    }
  });
});

// ✅ Use exact table name: 'subject'
app.get("/api/subject", (req, res) => {
  db.query("SELECT * FROM subject", (err, results) => {
    if (err) {
      console.error("Error fetching subjects:", err);
      res.status(500).send("Error retrieving subject list");
    } else {
      res.json(results);
    }
  });
});

app.get("/api/facultysubject", (req, res) => {
  db.query("SELECT * FROM facultysubject", (err, results) => {
    if (err) {
      console.error("Error fetching faculty-subject list:", err);
      res.status(500).send("Error fetching faculty-subject list");
    } else {
      res.json(results);
    }
  });
});

// POST: Add a salary entry
app.post("/api/salary", (req, res) => {
  const { FacultyID, Amount, PaymentDate } = req.body;
  db.query(
    "INSERT INTO salary (FacultyID, Amount, PaymentDate) VALUES (?, ?, ?)",
    [FacultyID, Amount, PaymentDate],
    (err, result) => {
      if (err) {
        console.error("Error inserting salary:", err);
        res.status(500).send("Error adding salary");
      } else {
        res.send("Salary added successfully");
      }
    }
  );
});

// GET: Fetch all salary records
app.get("/api/salary", (req, res) => {
  db.query("SELECT * FROM salary", (err, results) => {
    if (err) {
      console.error("Error fetching salaries:", err);
      res.status(500).send("Error retrieving salary list");
    } else {
      res.json(results);
    }
  });
});


app.delete("/api/facultysubject/:facultyID/:subID", (req, res) => {
  const { facultyID, subID } = req.params;
  db.query(
    "DELETE FROM facultysubject WHERE FacultyID = ? AND SubID = ?",
    [facultyID, subID],
    (err, result) => {
      if (err) {
        console.error("Error deleting assignment:", err);
        res.status(500).send("Error deleting faculty-subject record");
      } else {
        res.send("Faculty-Subject assignment deleted");
      }
    }
  );
});



app.delete("/api/salary/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM salary WHERE SalaryID = ?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting salary:", err);
      res.status(500).send("Failed to delete salary");
    } else {
      res.send("Salary deleted");
    }
  });
});

app.delete("/api/subject/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM subject WHERE SubID = ?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting subject:", err);
      res.status(500).send("Failed to delete subject");
    } else {
      res.send("Subject deleted");
    }
  });
});


// Start server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
