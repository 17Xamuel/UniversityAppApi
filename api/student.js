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
    `SELECT * FROM students_table WHERE 
    student_username = ? AND student_password = ?`,
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

router.post("/new-payment", async (req, res) => {
  const { amount, student_id, photo, date } = req.body;
  conn.query(
    `INSERT INTO payments_table SET ?`,
    {
      student_id: student_id,
      amount_paid: amount,
      student_photo: photo,
      payment_date: date,
    },
    (payment_err, payment_res) => {
      if (payment_err) {
        console.log(payment_err);
        res.send({ data: "Error" });
      } else {
        conn.query(
          `SELECT * FROM payments_table 
          WHERE student_id = ?`,
          student_id,
          (first_err, first_res) => {
            if (first_err) {
              console.log(first_err);
              res.send({ data: "Error" });
            } else {
              res.send({ data: first_res });
            }
          }
        );
      }
    }
  );
});

router.get("/payments/:id", async (req, res) => {
  conn.query(
    `SELECT * FROM payments_tbl 
    WHERE student_id = ?`,
    req.params.id,
    (first_err, first_res) => {
      if (first_err) {
        console.log(first_err);
        res.send({ data: "Error" });
      } else {
        res.send({ data: first_res });
      }
    }
  );
});

module.exports = router;
