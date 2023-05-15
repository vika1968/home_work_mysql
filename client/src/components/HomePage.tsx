import React, { useEffect, useState } from "react";
import "./HomePage.scss";
import { Link, useParams } from "react-router-dom";
import { getAllMovies } from "../helpers/api-helpers";
import MovieItem from "./Movies/MovieItem";
import MovieScheme from "./../helpers/MovieScheme";
import { userSelector } from "../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getUserByCookieMain } from "../features/user/userAPI";
import { User } from "../features/user/userModel";


const HomePage = () => {
  const [movies, setMovies] = useState<MovieScheme[]>([]);
 // const { user } = useParams();
  //const [activeUser, setActiveUser] = useState<string>();
  // const [emailInCookie, setEmailInCookie] = useState<string | null>(null);
  // const [userIDInCookie, setUserIDInCookie] = useState<number | null>(null);
  const [emailInStore, setEmailInStore] = useState<string | null>(null);
  // const [userIDInStore, setUserIDInStore] = useState<number | null>(null);  
  const [authorizedUser, setAuthorizedUser] = useState(false);

  const dispatch = useAppDispatch();

  const loggedInUser = useAppSelector(userSelector) as User[] | null;

  useEffect(() => {
    getAllMovies()
      .then((data: any) => setMovies(data.movies))
      .catch((err: any) => console.log(err));

       dispatch(getUserByCookieMain());

       //setEmailInStore()
     
  //  handleGetUserByID();   
  }, []);

  useEffect(() => {
    if (loggedInUser !== null) {
      // Update component state with loggedInUser value
      // For example, setEmailInStore(loggedInUser.email);
     // console.log(loggedInUser)
      setEmailInStore(loggedInUser[0].email);
    //  console.log(loggedInUser[0].email)
    }
  }, [loggedInUser]);

  // const handleGetUserByID = async () => {
  //   try {
  //     const { data } = await axios.get(`/api/user/${user}`);
  //     const activeUser = data;
  //     setActiveUser(activeUser.user[0].email);
  //     console.log('--------activeUser-----------');
  //     console.log(activeUser.user[0]);
  //     console.log('--------activeUser-----------');
  //   } catch (error: any) {
  //     console.error(error.response.data.error);
  //   }
  // };

  // const getUserByCookie = async () => {
  //   try {
  //     const response = await axios.get("/api/user/reducer/get-user-by-cookie");
  //     console.log(response.data);
  //     setEmailInCookie(response.data.userData[0].email);
  //     setUserIDInCookie(response.data.userData[0].userID);
  //     setEmailInStore(loggedInUser !== null && loggedInUser.length > 0 ? loggedInUser[0].email : null);
  //     setUserIDInStore(loggedInUser !== null && loggedInUser.length > 0 ? loggedInUser[0].userID : null);
      
  //     console.log('-----------------');
  //     console.log(emailInCookie);
  //     console.log(userIDInCookie);
  //     console.log(emailInStore);
  //     console.log(userIDInStore);
  //     console.log('-----------------');
      
  //     return response.data.userData; // Return an object with email and userID properties
  //   } catch (error: any) {
  //     alert(error.response.data.error);
  //   }
  // };

  // useEffect(() => {
  //   console.log('emailInCookie:', emailInCookie);
  //   console.log('userIDInCookie:', userIDInCookie);
  //   console.log('emailInStore:', emailInStore);
  //   console.log('userIDInStore:', userIDInStore);
  // }, [emailInCookie, userIDInCookie, emailInStore, userIDInStore]);

  const handleButtonClick = async () => {
    try {     
      
      loggedInUser !== null && loggedInUser.length > 0 ? setAuthorizedUser(true) : setAuthorizedUser(false)


     // setAuthorizedUser(false);
     // const userData = await getUserByCookie();
    //  console.log(userData[0].email);
  
    //  if (
      //  !loggedInUser ||
      //  loggedInUser.length === 0 //||
        // emailInStore === undefined ||
        // userIDInStore === undefined //||
      //  emailInStore !== userData[0].email ||
      //  userIDInStore !== userData[0].userID
    //  ) {
    //    setAuthorizedUser(false);
     //   alert(
    //      "You are not an authorized user and do not have the right to place an order."
      //  );
    //  } else {
    //    setAuthorizedUser(true);
    //  }
    } catch (error) {
     setAuthorizedUser(false);
     console.log(error);
      //console.error(error.message);
    }
  };
 
  return (
    <div className="HomePage__wrapper">    
      <h2>Hello : {emailInStore} </h2>
      <div className="HomePage__header">
        <img
          className="HomePage__logo"
          src="https://img.freepik.com/free-vector/cinema-stage-background-with-clapperboard-popcorn-chairs_1017-38722.jpg?w=1380&t=st=1683564862~exp=1683565462~hmac=53a85bdf6b58e70a6ca7d9f0e76624db6a39bd6622c26dbdca0c602122249f00"
          alt="cinema"
        />
      </div>
      <div className="HomePage__content">
        <h2 className="HomePage__title">Latest Releases</h2>
        <div className="HomePage__movies" onClick={handleButtonClick}>
          {movies &&
            movies
              .slice(0, 4)
              .map((movie: MovieScheme, index) => (
                <MovieItem
                key={movie.movieID}
                posterUrl={movie.posterUrl}
                releaseDate={movie.releaseDate}
                title={movie.title}
                movieID={movie.movieID}             
                authorizedUser = {authorizedUser}
                />
              ))}
        </div>
        <div className="HomePage__cta">
          <Link to="/movies" className="HomePage__button">
            View All Movies
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
