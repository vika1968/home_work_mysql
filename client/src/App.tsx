import { BrowserRouter, Route, Routes } from "react-router-dom";
import Movies from "./components/Movies/Movies";
import HomePage from "./components/HomePage";
import "./App.scss";
import Booking from "./components/Bookings/Booking";
import Login from "./app/views/login/Login";
import ChangeCredentials from "./app/views/changecredentials/ChangeCredentials";
import MovieListInsertOnce from "./helpers/MovieListInsertOnce";
import OrderResults from "./components/Orders/OrderResults";

function App() {
  return (
    <div>
      <BrowserRouter>
        <section>
          <Routes>
            <Route path="/" element={<Login />} />
            {/* Gili, this Route to add movies to DB */}
            {/* <Route path="/" element={<MovieListInsertOnce/>} /> */}           
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/change-credentials/:user" element={<ChangeCredentials />}/>
            <Route path="/movies" element={<Movies />} />
            <Route path="/booking/:id" element={<Booking />} />
            <Route path="/order/:id" element={<OrderResults />} />         
          </Routes>
        </section>
      </BrowserRouter>
    </div>
  );
}

export default App;
