import { BrowserRouter, Route, Routes } from "react-router-dom";
import Movies from "./components/Movies/Movies";
import HomePage from "./components/HomePage";
import "./App.scss";
import Booking from "./components/Bookings/Booking";
import Login from "./app/views/login/Login";
import ChangeCredentials from "./app/views/changecredentials/ChangeCredentials";

function App() {
  return (
    <div>
      <BrowserRouter>
        <section>
          <Routes>
            <Route path="/" element={<Login />} />
            {/* <Route path="/homepage/:user" element={<HomePage />} /> */}
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/change-credentials/:user" element={<ChangeCredentials />}/>
            <Route path="/movies" element={<Movies />} />
            <Route path="/booking/:id" element={<Booking />} />
          </Routes>
        </section>
      </BrowserRouter>
    </div>
  );
}

export default App;
