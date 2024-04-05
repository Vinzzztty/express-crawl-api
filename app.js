const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

//Middleware
const { isAuthenticated } = require("./middleware/isAuthenticated");

//Router
const indexRouter = require("./routes/index/index.router");
const testRouter = require("./routes/index/hello.router");

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

//Routes
app.use("/api/", testRouter);
app.use("/", isAuthenticated, indexRouter);

module.exports = app;
