const { urlencoded } = require("express");
const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");
const session = require("express-session");
const pgp = require("pg-promise")();
const movieRouter = require("./routes/movies");
const usersRouter = require("./routes/users");
const connectionString =
  "postgres://jigzmpev:ag-e4iYZ-g4kQOgnmVn4i-E6CYb2F_pl@chunee.db.elephantsql.com/jigzmpev";
const db = pgp(connectionString);

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
  db.any("SELECT * FROM moviestwo").then((movies) => {
    res.render("index", { movies: movies });
  });
});

app.listen(3000, () => {
  console.log("running...");
});
