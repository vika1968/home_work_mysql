"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static("client"));
const usersRoutes_1 = __importDefault(require("./API/users/usersRoutes"));
app.use("/api/user", usersRoutes_1.default);
const movieRoutes_1 = __importDefault(require("./API/movies/movieRoutes"));
app.use("/api/movie", movieRoutes_1.default);
const bookingRoutes_1 = __importDefault(require("./API/bookings/bookingRoutes"));
app.use("/api/booking", bookingRoutes_1.default);
const ordersRoutes_1 = __importDefault(require("./API/orders/ordersRoutes"));
app.use("/api/order", ordersRoutes_1.default);
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
