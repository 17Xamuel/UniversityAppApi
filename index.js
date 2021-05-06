const express = require("express");
const conn = require("./db/db");
const uuid = require("uuid");
const bcrypt = require("bcryptjs");
const app = express();


const PORT = process.env.PORT||8080;

app.use(express.json());

app.post("/api/user/new", (req, res) => {
  console.log(req.body)
  const reg_no = req.body.reg_no ? req.body.reg_no : "";
  const user_course = reg_no.slice(10, 13).toUpperCase();
  const user_year = reg_no.slice(0, 2);
  const user_class = user_course + "-" + user_year;
  conn.query(
    "select * from classes_table where class_name = ?",
    user_class,
    async (err, class_result) => {
      if (err || class_result.length > 0) {
        let user_password = await bcrypt.hash(req.body.password, 2);
        let user_obj = {
          user_id: uuid.v4(),
          user_name: req.body.username,
          reg_no: req.body.reg_no,
          user_password,
          user_class: class_result[0].class_id,
          user_nature: req.body.nature,
          user_profile_photo: null,
        };
        conn.query(
          "select * from users_table where reg_no = ?",
          user_obj.reg_no,
          (error, result) => {
            if (error) {
              res.send("Error");
              return;
            } else {
              if (result.length > 0) {
                res.send("Error");
                return;
              } else {
                conn.query("insert into users_table set ?", user_obj, (err) => {
                  if (err) {
                    res.send("Error");
                    return;
                  } else {
                    res.send(user_obj);
                  }
                });
              }
            }
          }
        );
      } else {
        const class_id = uuid.v4();
        conn.query(
          "insert into classes_table set ?",
          { class_id, class_name: user_class },
          async (error) => {
            if (error) {
              res.send("Error");
              return;
            } else {
             
              let user_password = await bcrypt.hash(req.body.password, 2);
              let user_obj = {
                user_id: uuid.v4(),
                user_name: req.body.username,
                reg_no: req.body.reg_no,
                user_password,
                user_class: class_id,
                user_nature: req.body.nature,
                user_profile_photo: null,
              };
              conn.query(
                "select * from users_table where reg_no = ?",
                user_obj.reg_no,
                (error, result) => {
                  if (error) {
                    res.send("Error");
                    return;
                  } else {
                    if (result.length > 0) {
                      res.send("Error");
                      return;
                    } else {
                      conn.query(
                        "insert into users_table set ?",
                        user_obj,
                        (err) => {
                          if (err) {
                            res.send("Error");
                            return;
                          } else {
                            res.send(user_obj);
                          }
                        }
                      );
                    }
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});
app.post("/api/user/login", (req, res) => {
  conn.query(
    "select * from users_table where user_name = ?",
    req.body.username,
    (err, result) => {
      if (err) {
        console.log(err);
        return res.send("Error");
      } else {
        result.forEach(async (r) => {
          let password_check = await bcrypt.compare(
            req.body.password,
            r.user_password
          );
          if (password_check) {
            delete r.user_password;
            return res.send(r);
          } else {
            return res.send("Error");
          }
        });
      }
    }
  );
});
app.get("/api/users", (req, res) => {
  conn.query("select * from users_table", (err, result) => {
    if (err) {
    } else {
      res.send(result);
    }
  });
});
app.listen(PORT, () => {
  
  console.log(`Server Started on port ${PORT}.....`);
});
