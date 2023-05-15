
import React, { useEffect, useState } from "react";
import "./Booking.scss";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetails, newBooking } from "../../helpers/api-helpers";
import MovieSchemeFull from "../../helpers/MovieSchemeFull";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { userSelector } from "../../features/user/userSlice";
import { getUserByCookieMain } from "../../features/user/userAPI";

const Booking = () => {
  const [movie, setMovie] = useState<MovieSchemeFull | null>(null);
  const [activeUser, setActiveUser] = useState<number | undefined>();
  const [inputs, setInputs] = useState<{ seatNumber: string; date: string }>({seatNumber: "", date: "" });
  const { id } = useParams<{ id: string }>();

  const dispatch = useAppDispatch();
  const user = useAppSelector(userSelector);

  const navigate = useNavigate();

  useEffect(() => {
    fetchMovieDetails();
    getUserByCookie2();

   // dispatch(compareUserWithCookie());
    dispatch(getUserByCookieMain);
    // if (user === undefined) {
    //   alert("Sorry, you are an unauthorized user. Please login or register.");
    //   navigate("/");
    // }
  }, [id]);

  // useEffect(() => {
  //   dispatch(compareUserWithCookie());
  //   if (user == undefined) {
  //     alert ("Sorry, you are an unauthorized user. Please login or register.")
  //     navigate("/");
  //   }
  // }, []);

  const fetchMovieDetails = async () => {
    try {
      const res = await getMovieDetails(id);
      setMovie(res.movie[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const getUserByCookie2 = async () => {
    try {    
      const { data } = await axios.get("/api/user/reducer/get-user-by-cookie");       
      console.log(data)
      if (!data) throw new Error("Client not defined. ");         
      console.log(data.userData[0].userID)
       if (!data.userData[0].userID) {
         navigate("/");
       }
      setActiveUser(data.userData[0].userID);
    } catch (error: any) {
      console.error(error.response.data.error);
    }
  };

  const handleChangeSeatNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("----Add booking----------");
    console.log(inputs);
    if (movie) {
      newBooking({ ...inputs, movie: movie.movieID, userID: activeUser })
        .then((res) => alert(res.success))
        .catch((err) => console.log(err));
    }
  };

  const handleGoBack = () => {
    navigate("/movies");
  };

  return (
    <div>
      {movie && (
        <div>
          <div className="booking__header">
            <hr />
            <h4 className="title">
              <u>Book Tickets of Movie: "{movie.title}"</u>
            </h4>
            <hr />
          </div>
          <div className="booking">
            <div className="booking__poster">
              <img src={movie.posterUrl} alt={movie.title} />
            </div>
            <div className="booking__form">
              <form onSubmit={handleSubmit}>
                <label>Seat Number:</label>
                <input
                  name="seatNumber"
                  value={inputs.seatNumber}
                  onChange={handleChangeSeatNumber}
                  type="number"
                  required
                />
                <label>Booking Date:</label>
                <input
                  name="date"
                  type="date"
                  value={inputs.date}
                  onChange={handleChangeSeatNumber}
                  required
                />
                <button type="submit">Book Now</button>
              </form>
              <div className="booking__details">
                <p>{movie.description}</p>
                <p>
                  <strong>Starrer:</strong> {movie.actors}
                </p>
                <p>
                  <strong>Release Date:</strong>{" "}
                  {new Date(movie.releaseDate).toDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="booking-btn__container">
        <button className="booking-btn__goBack" onClick={handleGoBack}>
          Go to all movies
        </button>
      </div>
    </div>
  );
};

export default Booking;
