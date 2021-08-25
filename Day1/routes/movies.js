const express = require("express");
const router = express.Router();
// const pgp = require("pg-promise")();
// const connectionString =
//   "postgres://jigzmpev:ag-e4iYZ-g4kQOgnmVn4i-E6CYb2F_pl@chunee.db.elephantsql.com/jigzmpev";
// const db = pgp(connectionString);

global.moviesByGenre = [];
global.movieDetails = [];

router.post("/add-movie", (req, res) => {
  // const userID = req.session.username;

  // const id = movies.length + 1;
  const { title } = req.body;
  const { description } = req.body;
  const { genre } = req.body;

  if (req.session) {
    const movie = models.Movies.build({
      title: title,
      genre: genre,
      description: description,
    });
    movie.save().then((savedMovie) => {
      res.redirect("/");
    });
  }
});

router.post("/delete-movie", (req, res) => {
  const { id } = req.body;
  models.Movies.destroy({
    where: {
      id: id,
    },
  }).then(() => {
    res.redirect("/");
  });
});

router.get("/filter-genre", (req, res) => {
  res.render("filteredGenre");
});

router.post("/filter-genre", (req, res) => {
  const { genre } = req.body;

  models.Movies.findAll({
    where: {
      genre: genre,
    },
  }).then((movies) => {
    res.render("filteredGenre", { movies: movies });
  });
});

// moviesByGenre = [];

// moviesByGenre = movies.filter((movie) => movie.genre == genre);

// res.render("filteredGenre", { moviesByGenre: moviesByGenre });
// });

// router.get("/details", (req, res) => {
//   res.render("movieDetails");
// });

// router.post("/details", (req, res) => {
//   const { id } = req.body;
//   db.any('SELECT * FROM moviestwo WHERE "id" = $1', [id]).then((movies) => {
//     res.render("movieDetails", { movies: movies });
//   });

// movieDetails = movies.filter((movie) => movie.id == id);

// res.render("movieDetails", { movieDetails: movieDetails });
// });

module.exports = router;
