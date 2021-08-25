const { urlencoded } = require("express");
const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");
const session = require("express-session");
// const pgp = require("pg-promise")();
const movieRouter = require("./routes/movies");
const usersRouter = require("./routes/users");
global.models = require("./models");

app.use(express.urlencoded());
app.use(express.static("public"));
app.use(
  session({
    secret: "THISISSECRETKEY",
    saveUninitialized: true,
    resave: true,
  })
);
app.use("/movies", movieRouter);
app.use("/users", usersRouter);

// global.movies = [
//   {
//     userID: "john",
//     id: 1,
//     title: "Batman",
//     description: "guy in black suit kicking villians",
//     genre: "Action",
//     posterURL: "http://www.batman.com",
//     details: { 1: "detail 1", 2: "detail 2", 3: "deatail 3" },
//   },
// ];

app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");

app.get("/", (req, res) => {
  models.Movies.findAll({}).then((movies) => {
    if (req.session) {
      res.render("index", { movies: movies, username: req.session.username });
    } else {
      res.render("index", { movies: movies });
    }
  });
});

app.listen(3000, () => {
  console.log("running...");
});
