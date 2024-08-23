const pool = require("../../db");
const queries = require("./queries");

const getStudents = (req, res) => {
  pool.query(queries.getStudents, (error, result) => {
    if (error) throw error;
    res.status(200).json(result.rows);
  });
};

const getStudentsById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getStudentsById, [id], (error, result) => {
    if (error) throw error;
    res.status(200).json(result.rows);
  });
};

const addStudent = (req, res) => {
  const { name, email, age, dob } = req.body;
  // check if email exists
  pool.query(queries.checkEmailExists, [email], (error, result) => {
    if (result.rows.length) {
      res.send("Email Already Exists.");
    }

    // add student to db
    pool.query(queries.addStudent, [name, email, age, dob], (error, result) => {
      if (error) throw error;
      res.status(201).send("Student Created Successfully!.");
    });
  });
};

const removeStudent = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query(queries.getStudentsById, [id], (error, result) => {
    const noStudentFound = !result.rows.length;
    if (noStudentFound) {
      res.send("Student does not exist in the database");
    }

    pool.query(queries.removeStudent, [id], (error, result) => {
      if (error) throw error;
      res.status(200).send("Student removed successfully.");
    });
  });
};

const updateStudent = (req, res) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;

  pool.query(queries.getStudentsById, [id], (error, result) => {
    const noStudentFound = !result.rows.length;
    if (noStudentFound) {
      res.send("Student does not exist in the database");
    }

    pool.query(queries.updateStudent, [name, id], (error, result) => {
      if (error) throw error;
      res.status(200).send("Student updated successfully.");
    });
  });
};

module.exports = {
  getStudents,
  getStudentsById,
  addStudent,
  removeStudent,
  updateStudent,
};
