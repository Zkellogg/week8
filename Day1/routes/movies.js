const express = require("express");
const router = express.Router();
const pgp = require("pg-promise")();
const connectionString =
  "postgres://jigzmpev:ag-e4iYZ-g4kQOgnmVn4i-E6CYb2F_pl@chunee.db.elephantsql.com/jigzmpev";
const db = pgp(connectionString);

global.moviesByGenre = [];
global.movieDetails = [];

router.post("/add-movie", (req, res) => {
  const userID = req.session.username;

  // const id = movies.length + 1;
  const { title } = req.body;
  const { description } = req.body;
  const { genre } = req.body;
  const { posterURL } = req.body;

  if (req.session) {
    db.none(
      'INSERT INTO movies("userID", title, description, genre, "posterURL") VALUES($1, $2, $3, $4, $5)',
      [userID, title, description, genre, posterURL]
    ).then(() => {
      res.redirect("/");
    });
  }
});

router.post("/delete-movie", (req, res) => {
  const { id } = req.body;

  db.none('DELETE FROM movies WHERE "id" = $1', [id]).then(() => {
    res.redirect("/");
  });
});

router.get("/filter-genre", (req, res) => {
  res.render("filteredGenre");
});

router.post("/filter-genre", (req, res) => {
  const { genre } = req.body;

  db.any("SELECT * FROM movies WHERE genre= $1", [genre]).then((movies) => {
    res.render("filteredGenre", { movies: movies });
  });

  // moviesByGenre = [];

  // moviesByGenre = movies.filter((movie) => movie.genre == genre);

  // res.render("filteredGenre", { moviesByGenre: moviesByGenre });
});

router.get("/details", (req, res) => {
  res.render("movieDetails");
});

router.post("/details", (req, res) => {
  const { id } = req.body;
  db.any('SELECT * FROM movies WHERE "id" = $1', [id]).then((movies) => {
    res.render("movieDetails", { movies: movies });
  });

  // movieDetails = movies.filter((movie) => movie.id == id);

  // res.render("movieDetails", { movieDetails: movieDetails });
});

module.exports = router;
