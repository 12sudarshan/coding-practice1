const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("moviesData.db");
const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// API 1: Returns a list of all movie names in the movie table
app.get("/movies/", (req, res) => {
  db.all("SELECT movie_name FROM movie", (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Error fetching movie names" });
      return;
    }
    res.json(rows.map((row) => ({ movieName: row.movie_name })));
  });
});

// API 2: Creates a new movie in the movie table
app.post("/movies/", (req, res) => {
  const { directorId, movieName, leadActor } = req.body;
  db.run(
    "INSERT INTO movie (director_id, movie_name, lead_actor) VALUES (?, ?, ?)",
    [directorId, movieName, leadActor],
    function (err) {
      if (err) {
        res.status(500).json({ error: "Error creating movie" });
        return;
      }
      res.send("Movie Successfully Added");
    }
  );
});

// API 3: Returns a movie based on the movie ID
app.get("/movies/:movieId/", (req, res) => {
  const movieId = req.params.movieId;
  db.get("SELECT * FROM movie WHERE movie_id = ?", [movieId], (err, row) => {
    if (err) {
      res.status(500).json({ error: "Error fetching movie details" });
      return;
    }
    if (!row) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }
    res.json(row);
  });
});

// API 4: Updates the details of a movie in the movie table based on the movie ID
app.put("/movies/:movieId/", (req, res) => {
  const movieId = req.params.movieId;
  const { directorId, movieName, leadActor } = req.body;
  db.run(
    "UPDATE movie SET director_id = ?, movie_name = ?, lead_actor = ? WHERE movie_id = ?",
    [directorId, movieName, leadActor, movieId],
    function (err) {
      if (err) {
        res.status(500).json({ error: "Error updating movie details" });
        return;
      }
      res.send("Movie Details Updated");
    }
  );
});

// API 5: Deletes a movie from the movie table based on the movie ID
app.delete("/movies/:movieId/", (req, res) => {
  const movieId = req.params.movieId;
  db.run("DELETE FROM movie WHERE movie_id = ?", [movieId], function (err) {
    if (err) {
      res.status(500).json({ error: "Error deleting movie" });
      return;
    }
    res.send("Movie Removed");
  });
});

// API 6: Returns a list of all directors in the director table
app.get("/directors/", (req, res) => {
  db.all("SELECT * FROM director", (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Error fetching directors" });
      return;
    }
    res.json(rows);
  });
});

// API 7: Returns a list of all movie names directed by a specific director
app.get("/directors/:directorId/movies/", (req, res) => {
  const directorId = req.params.directorId;
  db.all(
    "SELECT movie_name FROM movie WHERE director_id = ?",
    [directorId],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: "Error fetching movie names" });
        return;
      }
      res.json(rows.map((row) => ({ movieName: row.movie_name })));
    }
  );
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

module.exports = app;
