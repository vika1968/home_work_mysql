import React, { useCallback, useEffect, useState } from "react";
import MovieItem from "./MovieItem";
import { getAllMovies } from "../../helpers/api-helpers";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { userSelector } from "../../features/user/userSlice";
import MovieSchemeFull from "../../helpers/MovieSchemeFull";
import axios from "axios";
import { User } from "../../features/user/userModel";

const Movies = () => {
  const [movies, setMovies] = useState<MovieSchemeFull[]>();
  const [searchQuery, setSearchQuery] = useState("");
  const [authorizedUser, setAuthorizedUser] = useState(false);
  // const [emailInStore, setEmailInStore] = useState<string | null>(null);
  // const [userIDInStore, setUserIDInStore] = useState<number | null>(null);
  // const [emailInCookie, setEmailInCookie] = useState<string | null>(null);
  // const [userIDInCookie, setUserIDInCookie] = useState<number | null>(null);
  const navigate = useNavigate();

  //const dispatch = useAppDispatch();
  //const user = useAppSelector(userSelector);
  const user = useAppSelector(userSelector) as User[] | null;

  // const getUserByCookie = async () => {
  //   try {
  //     const { data } = await axios.get("/api/user/reducer/get-user-by-cookie");
  //     setEmailInCookie(data.userData[0].email);
  //     setUserIDInCookie(data.userData[0].userID);
  //     setEmailInStore(user !== null && user.length > 0 ? user[0].email : null);
  //     setUserIDInStore(user !== null && user.length > 0 ? user[0].userID : null);
  //   } catch (error: any) {
  //     //console.error('error.response.data.error');
  //     alert(error.response.data.error);
  //   }
  // };

  const fetchData = async () => {
    try {
      const data = await getAllMovies();
      setMovies(data.movies);
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // useEffect(() => {
  //   if (user !== null) {
  //     // Update component state with loggedInUser value
  //     // For example, setEmailInStore(loggedInUser.email);
  //    // console.log(loggedInUser)
  //   //  setEmailInStore(user[0].email);
  //     console.log(user[0].email)
  //   }
  // }, [user]);

  const handleGoBack = () => {
   // if (user) {
     // navigate(`/homepage/${user[0].userID}`);
     navigate(`/homepage`);
    // } else {
    //   navigate("/homepage/0");
    // }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleButtonClick = async () => {
    try {

      user !== null && user.length > 0 ? setAuthorizedUser(true) : setAuthorizedUser(false)

      // setAuthorizedUser(false);
      // getUserByCookie();
      // if (
      //   !user ||
      //   user === undefined ||
      //   user === null ||
      //   emailInStore !== emailInCookie ||
      //   userIDInStore !== userIDInCookie
      // ) {
      //   setAuthorizedUser(false);
      //   alert(
      //     "You are not an authorized user and do not have the right to place an order."
      //   );
      // } else {
      //   setAuthorizedUser(true);
      // }
    } catch (error: any) {
      setAuthorizedUser(false);
      console.log(error);      
    }
  };

    //-------------First block ---------------------------------------
  // useEffect(() => {
  //   if (searchQuery.trim() !== "") {
  //     searchMovies(searchQuery)
  //       .then((data) => {
  //         setMovies(data.movies);
  //       })
  //       .catch((err: any) => {
  //         console.log(err);
  //       });
  //   } else {
  //     fetchData();
  //   }
  // }, [searchQuery]);

  // const searchMovies = async (query: string) => {
  //   try {
  //     const response = await axios.post("/api/movie/search-movies", { query });
  //     console.log(response.data);
  //     return response.data;
  //   } catch (error) {
  //     console.log(error);
  //     throw error;
  //   }
  // };

    //-------------Second block useCallback---------------------------------------
    // ---------------------Gili  this information. :) -------------------------------
//   // I've read about callback and tried to use them. The code works. You can try. (Second block)
//   // Using useCallback helps optimize the useEffect and useState hooks, as it prevents the searchMovies function from being re-created every time the component is rendered.
//   // As a result, when the searchQuery dependency changes, useEffect will not consider the searchMovies function as new and will not call it again.
//   // Thus, using a second block of code can reduce redundant function calls and improve performance when working with hooks.
//   //This is irrelevant with a small amount of data like mine and a small number of requests.
//   // That's why I left first block, because we didn't learn callback, OK?

  const searchMovies = useCallback(async (query: any) => {
    try {
      const response = await axios.post("/api/movie/search-movies", { query });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }, []);

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      searchMovies(searchQuery)
        .then((data: any) => {
          setMovies(data.movies);
        })
        .catch((err: any) => {
          console.log(err);
        });
    } else {
      fetchData();
    }
  }, [searchQuery, searchMovies]);
  //----------------------------------------------------------


  return (
    <div className="movies">
      <h4 className="movies__title">
        Movie list
        <div className="movies__title-search">
          <input
            type="text"
            placeholder="Search movies here... To cancel the search, press 'Backspace' on the keyboard several times."
            value={searchQuery}
            onChange={handleSearchChange}
            className="movies__input"
          />
        </div>
      </h4>

      <div className="movies__list" onClick={handleButtonClick}>
        {movies &&
          movies.map((movie) => (
            <MovieItem
              key={movie.movieID}
              posterUrl={movie.posterUrl}
              releaseDate={movie.releaseDate}
              title={movie.title}
              movieID={movie.movieID}
              authorizedUser={authorizedUser}
            />
          ))}
      </div>

      <div className="booking-btn__container">
        <button className="booking-btn__goBack" onClick={handleGoBack}>
          Go to latest releases
        </button>
      </div>
    </div>
  );
};

export default Movies;
