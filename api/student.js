const router = require("express").Router();
const conn = require("../database/mysql");

router.post("/new", (req, res) => {
  let { username, password } = req.body;
  conn.query(
    "SELECT * FROM students_table WHERE student_username = ?",
    username,
    (error, username_check_res) => {
      if (error) {
        res.send({ data: "Error" });
        throw error;
      } else {
        if (username_check_res.length > 0) {
          res.send({ data: "Exits" });
        } else {
          conn.query(
            "INSERT INTO students_table SET ?",
            {
              student_username: username,
              student_password: password,
            },
            (err, result) => {
              if (err) {
                res.send({ data: "Error" });
                throw err;
              } else {
                res.send({
                  data: "true",
                  student_username: username,
                  student_password: password,
                });
              }
            }
          );
        }
      }
    }
  );
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;
  conn.query(
    "SELECT * FROM students_table WHERE student_username = ? AND student_password = ?",
    [username, password],
    (err, result) => {
      if (err) {
        res.send({ data: "Error" });
        throw err;
      } else {
        if (result.length > 0) {
          res.send({
            data: "true",
            student_username: username,
            student_password: password,
          });
        } else {
          res.send({ data: "Wrong_details" });
        }
      }
    }
  );
});

module.exports = router;
