import axios, { AxiosResponse } from "axios";
import UserScheme from "./UserScheme";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const newBooking = async (data: any) => {

  const res: any = await axios.post("/api/booking", { movie: data.movie, seatNumber: data.seatNumber, date: data.date, user: data.userID })
    .catch((err: any) => console.log(err.response.data.error));
  //console.log(res.status)
  if (res.status !== 200 && res.status !== 201) {
    return console.log("Unexpected Error");
  }
  const resData = await res.data;
  return resData;
};

// export const compareUserWithCookie = createAsyncThunk("compare-cookie", async (_, thunkApi) => {
//   try {
//     const { data } = await axios.get("/api/user/compare-cookie");
//     console.log(data) 

//    if (!data) throw new Error("Couldn't receive data from axios GET '/compare-user-by-cookie' from: userAPI ");
//     const { userData} = data;
//     console.log(  userData  )
//     return userData;
//   } catch (error: any) {
//     console.error(error.response.data.error);
//     return thunkApi.rejectWithValue({
//       error: error.response.data.error,
//       message: error.response.data.error,
//     });
//   }
// }
// );


// export const compareUserWithCookie = createAsyncThunk("compare", async (_, thunkApi) => {
//   try {
//     console.log('compareUserWithCookie')
//     const { data } = await axios.get("/api/user/compare-by-cookie");
//     console.log(data)
//    console.log(data.userData)

//     if (!data) throw new Error("Couldn't receive data from axios GET '/compare-cookie' from: userAPI ");
//     const { userData } = data;
//     console.log('results2')
//     console.log('userData')
//     return userData;
//   } catch (error: any) {
//     console.error(error.response.data.error);
//     return thunkApi.rejectWithValue({
//       error: error.response.data.error,
//       message: error.response.data.error,
//     });
//   }
// }
// );

// export const compareUserWithCookie = createAsyncThunk("compare-cookie", async (_, thunkApi) => {
//   try {
//     const { data } = await axios.get("/api/user/compare/compare-cookie");
//     if (!data) throw new Error("Couldn't receive data from axios GET '/get-user-by-cookie' from: userAPI ");
//     const { userDB } = data;
//     return userDB;
//   } catch (error: any) {
//     console.error(error.response.data.error);
//     return thunkApi.rejectWithValue({
//       error: error.response.data.error,
//       message: error.response.data.error,
//     });
//   }
// }
// );





// export const getAllMovies = async () => {
//   const res: any = await axios.get("/api/movie").catch((err: any) => console.log(err));
//   console.log(res)
//   if (res.status !== 200) {
//     return console.log("No Data");
//   }

//   const data = await res.data;
//   return data;
// };

// export const getAllMovies = async () => {
//   try {
//     const res = await axios.get("/api/movie");
//     if (res.status !== 200) {
//       console.log("No Data");
//       return;
//     }
//     console.log( res.data);
//     return res.data;
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const getAllMovies = async () => {
//   try {
//     const { data } = await axios.get("/api/movie");
//     if (data.status !== 200) {
//       console.log("No Data");
//       return;
//     }
//     console.log( data);
//     return data;
//   } catch (error: any) {
//     console.error(error.response.data.error);
//   }
// };


export async function getAllMovies() {
  try {
    const { data } = await axios.get("/api/movie");
    return data;
  } catch (error: any) {
    console.error(error.response.data.error);
  }
}

// export async function getAllMovies() {
//     try {
//       const { data } = await axios.get("/api/movie");
//       const movieArray = data.moviesDB;

//      console.log(data)
//     } catch (error: any) {
//       console.error(error.response.data.error);
//     }
//   }

// export async function getAllMovies() {
//   try {
//     const { data } = await axios.get('/api/movie');
//     const movies = data.results;
//     console.log(movies)
//    // return movies;
//   } catch (error: any) {
//     console.error(error.response.data.error);
//     return null;
//   }
// }

// export interface Movie {
//   id: number;
//   title: string;
//   releaseDate: string;
//   posterUrl: string;
// }


export const sendUserAuthRequest = async (data: { name: any; email: any; password: any; }, signup: any) => {
  const res: any = await axios
    .post(`api/user/${signup ? "signup" : "login"}`, {
      name: signup ? data.name : "",
      email: data.email,
      password: data.password,
    })
    .catch((err) => console.log(err));

  if (res.status !== 200 && res.status !== 201) {
    console.log("Unexpected Error Occurred");
  }

  const resData = await res.data;
  return resData;
};

export const sendAdminAuthRequest = async (data: any) => {
  const res: any = await axios.post("/api/admin/login", { email: data.email, password: data.password })
    .catch((err: any) => console.log(err));

  if (res.status !== 200) {
    return console.log("Unexpected Error");
  }
  const resData = await res.data;
  return resData;
};

export const adminLogin = async (data: any) => {
  const res: any = await axios.post("/api/admin/login", { email: data.email, password: data.password, })
    .catch((err: any) => console.log(err));

  if (res.status !== 200) {
    return console.log("Unexpectyed Error");
  }
  const resData = await res.data;
  return resData;
};

// export const getMovieDetails = async (id) => {
//   const res = await axios.get(`/movie/${id}`).catch((err) => console.log(err));
//   if (res.status !== 200) {
//     return console.log("Unexpected Error");
//   }
//   const resData = await res.data;
//   return resData;
// };

export async function getMovieDetails(id: any) {
  try {
    const { data } = await axios.get(`/api/movie/${id}`);
    //console.log("--data66-------")
    // console.log( data)
    //  console.log("--data66-------")
    return data;
  } catch (error: any) {
    console.error(error.response.data.error);
  }
}


export const getUserBooking = async () => {
  const id = localStorage.getItem("userId");
  const res: any = await axios.get(`/api/user/booking/${id}`)
    .catch((err) => console.log(err));

  if (res.status !== 200) {
    console.log("Unexpected Error");
    return null;
  }
  const resData = await res.data;
  return resData;
};
export const deleteBooking = async (id: any) => {
  const res: any = await axios
    .delete(`/booking/${id}`)
    .catch((err) => console.log(err));

  if (res.status !== 200) {
    return console.log("Unepxected Error");
  }

  const resData = await res.data;
  return resData;
};


// export const getUserDetails = async () => {
//   const id = localStorage.getItem("userId");
//   const res: AxiosResponse  = await axios.get(`/api/user/${id}`).catch((err) => console.log(err));
//   if (res.status !== 200) {
//     return console.log("Unexpected Error");
//   }
//   const resData = await res.data;
//   return resData;
// };

// export const getUserDetails = async () => {
//   const id = localStorage.getItem("userId");
//   let res: AxiosResponse;

//   try {
//     res = await axios.get(`/api/user/${id}`);
//   } catch (err) {
//     console.log(err);
//     throw new Error("Unexpected error");
//   }

//   const resData = await res.data;
//   return resData;
// };

interface UserResponse {
  user: UserScheme;
}

// export const getUserDetails = async (): Promise<UserResponse> => {
//   const id = localStorage.getItem("userId");
//   let res: AxiosResponse;

//   try {
//     res = await axios.get(`/api/user/${id}`);
//   } catch (err) {
//     console.log(err);
//     throw new Error("Unexpected error");
//   }

//   const resData = await res.data;
//   return resData;
// };




export const addMovie = async (data: any) => {
  const res: any = await axios.post("/api/movie",
    {
      title: data.title,
      description: data.description,
      releaseDate: data.releaseDate,
      posterUrl: data.posterUrl,
      fetaured: data.fetaured,
      actors: data.actors,
      admin: localStorage.getItem("adminId"),
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  )
    .catch((err: any) => console.log(err));

  if (res.status !== 201) {
    return console.log("Unexpected Error Occurred");
  }

  const resData = await res.data;
  return resData;
};

export const getAdminById = async () => {
  const adminId = localStorage.getItem("adminId");
  const res: any = await axios
    .get(`api/admin/${adminId}`)
    .catch((err) => console.log(err));

  if (res.status !== 200) {
    return console.log("Unexpected Error Occurred");
  }

  const resData = await res.data;
  return resData;
};


