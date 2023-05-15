// import React from "react";
// import { Link } from "react-router-dom";

// interface MovieItemProps {
//   title: string;
//   releaseDate: string;
//   posterUrl: string;
//   movieID: number;
// }

// const MovieItem: React.FC<MovieItemProps> = ({
//   title,
//   releaseDate,
//   posterUrl,
//   movieID,
// }) => {
//   return (
//     <div className="movie-item">
//       <img className="movie-item__poster" src={posterUrl} alt={title} />
//       <div className="movie-item__content">
//         <h3 className="movie-item__title">{title}</h3>
//         <p className="movie-item__release-date">
//           {new Date(releaseDate).toDateString()}
//         </p>
//       </div>
//       <div className="movie-item__actions">
//         <Link className="movie-item__book-btn" to={`/booking/${movieID}`}>
//           Book Here
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default MovieItem;
// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// interface MovieItemProps {
//   title: string;
//   releaseDate: string;
//   posterUrl: string;
//   movieID: number;

//   isButtonClicked: boolean;
// }

// const MovieItem: React.FC<MovieItemProps> = ({
//   title,
//   releaseDate,
//   posterUrl,
//   movieID,
// ,
// }) => {

//   const handleButtonClick = () => {
//     // setIsButtonClicked(true);
//     // onButtonClick(); // Вызываем переданную функцию для обработки нажатия кнопки
//     // console.log(isButtonClicked);
//   };

//   return (
//     <div className="movie-item">
//       <img className="movie-item__poster" src={posterUrl} alt={title} />
//       <div className="movie-item__content">
//         <h3 className="movie-item__title">{title}</h3>
//         <p className="movie-item__release-date">
//           {new Date(releaseDate).toDateString()}
//         </p>
//       </div>
//       <div className="movie-item__actions">
//         {isButtonClicked ? (
//           <>
//             <p>Button Clicked</p>
//             {alert("Button clicked")}
//           </>
//         ) : (
//           <Link
//             className="movie-item__book-btn"
//             to={`/booking/${movieID}`}
//             onClick={handleButtonClick}
//           >
//             Book Here
//           </Link>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MovieItem;

// import React from "react";
// import { Link } from "react-router-dom";

// interface MovieItemProps {
//   title: string;
//   releaseDate: string;
//   posterUrl: string;
//   movieID: number;
//   isButtonClicked: boolean;
//   onButtonClick: () => void;
//   athorizedUser: boolean;
// }

// const MovieItem: React.FC<MovieItemProps> = ({
//   title,
//   releaseDate,
//   posterUrl,
//   movieID,
//   isButtonClicked,
//   onButtonClick,
//   athorizedUser,
// }) => {
//   const handleClick = () => {
//     onButtonClick();
//     alert("Button clicked");
//     console.log(athorizedUser);
//     console.log(athorizedUser);
//   };

//   return (
//     <div className="movie-item">
//       <img className="movie-item__poster" src={posterUrl} alt={title} />
//       <div className="movie-item__content">
//         <h3 className="movie-item__title">{title}</h3>
//         <p className="movie-item__release-date">
//           {new Date(releaseDate).toDateString()}
//         </p>
//       </div>
//       <div className="movie-item__actions">
//         {isButtonClicked && !athorizedUser ? (
//           <p>Book Here</p>
//         ) : (
//           <Link
//             className="movie-item__book-btn"
//             to={`/booking/${movieID}`}
//             onClick={handleClick}
//           >
//             Book Here
//           </Link>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MovieItem;

import React from "react";
import { Link } from "react-router-dom";

interface MovieItemProps {
  title: string;
  releaseDate: string;
  posterUrl: string;
  movieID: number;
  authorizedUser: boolean;
}

const MovieItem: React.FC<MovieItemProps> = ({
  title,
  releaseDate,
  posterUrl,
  movieID,
  authorizedUser,
}) => {
  return (
    <div className="movie-item">
      <img className="movie-item__poster" src={posterUrl} alt={title} />
      <div className="movie-item__content">
        <h3 className="movie-item__title">{title}</h3>
        <p className="movie-item__release-date">
          {new Date(releaseDate).toDateString()}
        </p>
      </div>
      <div className="movie-item__actions">
        <Link
          className="movie-item__book-btn"
          to={`/booking/${movieID}`}
          onClick={(event) => {
            if (!authorizedUser) {
              event.preventDefault(); 
            }
          }}
        >
          Book Here
        </Link>
      </div>
      {/* <div className="movie-item__actions">
        <Link className="movie-item__book-btn" to={`/booking/${movieID}`}>
          Book Here
        </Link>
      </div> */}
    </div>
  );
};

export default MovieItem;
