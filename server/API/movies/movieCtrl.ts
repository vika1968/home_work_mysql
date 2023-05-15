import jwt from "jsonwebtoken";
//import mongoose from "mongoose";
//import Admin from "../models/Admin";
//import Movie from "../models/Movie";
import express from "express";
import connection from "../../DB/database";


// export const addMovie = (req: Request, res: Response) => {
//   const extractedToken = req.headers.authorization.split(" ")[1];
//   if (!extractedToken || extractedToken.trim() === "") {
//     return res.status(404).json({ message: "Token Not Found" });
//   }

//   let adminId: number;

//   // verify token
//   jwt.verify(extractedToken, process.env.SECRET_KEY, (err, decrypted) => {
//     if (err) {
//       return res.status(400).json({ message: `${err.message}` });
//     } else {
//       adminId = decrypted.id;
//       return;
//     }
//   });

//   //create new movie
//   const { title, description, releaseDate, posterUrl, featured, actors } =
//     req.body;
//   if (
//     !title ||
//     title.trim() === "" ||
//     !description ||
//     description.trim() === "" ||
//     !posterUrl ||
//     posterUrl.trim() === ""
//   ) {
//     return res.status(422).json({ message: "Invalid Inputs" });
//   }

//   const connection: Connection = req.app.locals.connection;

//   connection.beginTransaction((err) => {
//     if (err) {
//       return res.status(500).json({ message: "Request Failed" });
//     }
//     connection.query(
//       `INSERT INTO movies (description, releaseDate, featured, actors, adminId, posterUrl, title) VALUES (?, ?, ?, ?, ?, ?, ?)`,
//       [description, new Date(`${releaseDate}`), featured, actors, adminId, posterUrl, title],
//       (err, results) => {
//         if (err) {
//           connection.rollback();
//           console.log(err);
//           return res.status(500).json({ message: "Request Failed" });
//         }
//         const movieId = results.insertId;
//         connection.query(
//           `SELECT * FROM movies WHERE id = ?`,
//           [movieId],
//           (err, results) => {
//             if (err) {
//               connection.rollback();
//               console.log(err);
//               return res.status(500).json({ message: "Request Failed" });
//             }
//             const movie = results[0];
//             connection.query(
//               `UPDATE admins SET addedMovies = JSON_ARRAY_APPEND(addedMovies, '$', ?) WHERE id = ?`,
//               [movieId, adminId],
//               (err) => {
//                 if (err) {
//                   connection.rollback();
//                   console.log(err);
//                   return res.status(500).json({ message: "Request Failed" });
//                 }
//                 connection.commit((err) => {
//                   if (err) {
//                     connection.rollback();
//                     console.log(err);
//                     return res.status(500).json({ message: "Request Failed" });
//                   }
//                   return res.status(201).json({ movie });
//                 });
//               }
//             );
//           }
//         );
//       }
//     );
//   });
// };

// export const getAllMovies = async (req, res, next) => {
//   let movies;

//   try {
//     movies = await Movie.find();
//   } catch (err) {
//     return console.log(err);
//   }

//   if (!movies) {
//     return res.status(500).json({ message: "Request Failed" });
//   }
//   return res.status(200).json({ movies });
// };


// export const getMovieById = async (req, res, next) => {
//   const id = req.params.id;
//   let movie;
//   try {
//     movie = await Movie.findById(id);
//   } catch (err) {
//     return console.log(err);
//   }

//   if (!movie) {
//     return res.status(404).json({ message: "Invalid Movie ID" });
//   }

//   return res.status(200).json({ movie });
// };


export const getMovieById = (req: express.Request, res: express.Response) => {
  const id = req.params.id;
  // console.log( 'getMovieById');
  // console.log( req.params.id);
  const query = `SELECT * FROM movies WHERE movieID='${id}'`;
  //     (err, results) => {
  //       if (err) {
  //         console.log(err);
  //         return res.status(500).json({ message: "Internal Server Error" });
  //       }
  //       if ((results as any[]).length === 0) {
  //         console.log("Invalid Movie ID");
  //         return res.status(404).json({ message: "Invalid Movie ID" });
  //       }
  //       const movie = results;
  //       return res.status(200).json({ movie });
  //     }
  //   );
  // };
  connection.query(query, (error, results) => {
    try {
      if (error) {
        console.log(error);
        return res.status(500).json({  success: false, error: "Internal Server Error" });
      } 

      if ((results as any[]).length === 0) {
        console.log("Invalid Movie ID");
        return res.status(404).json({  success: false, error: "Invalid Movie ID" });
      }
      const movie = results;
    //  console.log(movie)
      return res.status(200).json({ movie });


      // res.send({ ok: true, userArray: results });
    } catch (error: any) {
      console.log(error);
      res.status(500).send({ sucess: false, error: error.message });
    }
  });
}
//------------------------

// app.post("/api/insert-into-movies", (req: express.Request, res: express.Response) => {
//     const { title, year, runtime, director, actors, plot, posterUrl } = req.body;
//     const query = `INSERT INTO blockbuster.movies (title, year, runtime, director, actors, plot, posterUrl) VALUES ("${title}", ${year}, ${runtime}, "${director}", "${actors}", "${plot}", "${posterUrl}");`;
//     connection.query(query, (err, results, fields) => {
//       try {
//         if (err) throw err;
//         // console.log(results);
//         res.send({ results, ok: true });
//       } catch (error: any) {
//         console.log(error);
//         res.send({ ok: false, error: error.message });
//       }
//     });
//   });

// app.post("/api/insert-into-movies", (req: express.Request, res: express.Response) => {
//     const { title, year, runtime, director, actors, plot, posterUrl } = req.body;
//     const query = `INSERT INTO blockbuster.movies (title, year, runtime, director, actors, plot, posterUrl) VALUES ("${title}", ${year}, ${runtime}, "${director}", "${actors}", "${plot}", "${posterUrl}");`;
//     connection.query(query, (err, results, fields) => {
//       try {
//         if (err) throw err;
//         // console.log(results);
//         res.send({ results, ok: true });
//       } catch (error: any) {
//         console.log(error);
//         res.send({ ok: false, error: error.message });
//       }
//     });
//   });

export async function insertIntoMoviesTable(req: express.Request, res: express.Response) {
  try {
    const { title, description, actors, releaseDate, posterUrl, featured, adminID } = req.body;
    const query = `INSERT INTO \`movie-booking\`.\`movies\` (title, description, actors, releaseDate, posterUrl, featured, adminID ) VALUES ("${title.replace(/"/g, '\\"')}", "${description.replace(/"/g, '\\"')}", "${actors.replace(/"/g, '\\"')}", "${releaseDate.replace(/"/g, '\\"')}", "${posterUrl.replace(/"/g, '\\"')}", ${featured}, ${adminID});`;
    // console.log(query);
    connection.query(query, (err, results) => {
      try {
        if (err) throw err;
        res.send({ results })
      } catch (error: any) {
        res.status(500).send({ error: error.message })
      }
    })
  } catch (error: any) {
    res.status(500).send({ error: error.message })
  }
}
//  const myString = "\"Hello\"";
// console.log(myString); // Out output : "Hello"
//------------------------

// export async function getAllMovies(req: express.Request, res: express.Response) {
//     try {
//         const query = 'SELECT * FROM `movie-booking`.`movies`'
//         console.log(query);
//         let movies: any;
//         connection.query(query, (err, results) => {
//             try {
//                 if (err) throw err;
//                 movies = results; 
//                 if (!movies) {
//                     return res.status(500).json({ message: "Request Failed" });
//                 }
//                 console.log(movies);
//                return res.status(200).json({ movies });

//             } catch (error: any) {
//                 res.status(500).send({error: error.message})
//             }
//         })
//     } catch (error: any) {
//         res.status(500).send({error: error.message})
//     }
// }


export async function getAllMovies(req: express.Request, res: express.Response) {
  try {
    const query = 'SELECT * FROM `movie-booking`.`movies`'
    //console.log('Executing query:', query);
    let movies: any;
    connection.query(query, (err, results) => {
      try {
        if (err) throw err;
       // console.log('Query results:', results);
        movies = results;
        if (!movies) {
          return res.status(500).json({ message: "Request Failed" });
        }
       // console.log('Returning movies:', movies);
        return res.status(200).json({ movies });     
        //res.status(200).send({movies})   
      } catch (error: any) {
        console.error('Error:', error);
        res.status(500).send({ error: error.message })
      }
    })

  } catch (error: any) {
    console.error('Error:', error);
    res.status(500).send({ error: error.message })
  }
}


export const searchMovies = (req: express.Request, res: express.Response) => {
  try {
    const searchQuery = req.body.query || '';
    const query = `SELECT * FROM \`movie-booking\`.\`movies\` WHERE title LIKE "%${(searchQuery || '').replace(/"/g, '\\"')}%" OR description LIKE "%${(searchQuery || '').replace(/"/g, '\\"')}%"`;
    console.log(query);
    connection.query(query, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({ success: false, error: "Internal server error" });
      } else {
        res.json({ success: true, movies: results });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
