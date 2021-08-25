const express = require("express");
const router = express.Router();
// const pgp = require("pg-promise")();
// const connectionString =
//   "postgres://jigzmpev:ag-e4iYZ-g4kQOgnmVn4i-E6CYb2F_pl@chunee.db.elephantsql.com/jigzmpev";
// // const db = pgp(connectionString);
var bcrypt = require("bcryptjs");

// // global.users = [
// //   { username: "john", password: "test1" },
// //   { username: "mike", password: "test2" },
// //   { username: "mary", password: "test3" },
// // ];

router.get("/register", (req, res) => {
  if (req.session) {
    req.session.currentUser = "";
  }
  res.render("registration");
});

router.post("/register", (req, res) => {
  const { username } = req.body;
  const { password } = req.body;

  bcrypt.genSalt(10, function (error, salt) {
    if (!error) {
      bcrypt.hash(password, salt, function (error, hash) {
        if (!error) {
          const user = models.Users.build({
            username: username,
            password: hash,
          });
          user.save().then(() => {
            res.render("login", {
              loginMessage: "Use new crediantials to login here!",
            });
          });
        } else {
          res.render("registration", {
            regError: "Could not process registration.",
          });
        }
      });
    } else {
      res.render("registration", {
        regError: "Could not process registration.",
      });
    }
  });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  const { username } = req.body;
  const { password } = req.body;
  models.Users.findOne({
    where: {
      username: username,
    },
  })
    .then((user) => {
      console.log(user);
      bcrypt.compare(password, user.password, function (error, result) {
        if (result) {
          if (req.session) {
            req.session.userID = user.id;
            req.session.username = username;
          }
          res.render("dashboard", {
            username: username,
          });
        } else {
          res.render("login", {
            errorMessage: "Username or Password Incorrect",
          });
        }
      });
    })
    .catch((error) => {
      res.send("USER NOT FOUND");
    });
});

// // global.myMovies = [];

// router.get("/dashboard", (req, res) => {
//   console.log(movies);
//   if (req.session) {
//     let myMovies = movies.filter(
//       (movie) => movie.userID == req.session.username
//     );
//     console.log(myMovies);
//     res.render("dashboard", {
//       username: req.session.username,
//       myMovies: myMovies,
//     });
//   }
// });

module.exports = router;
