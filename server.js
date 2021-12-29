const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// LOAD env vars
dotenv.config({ path: "./config/config.env" });

//Connect to DB
connectDB();

// Export Route files
const bootcampsRouter = require("./routes/bootcampRoute");
const courseRouter = require("./routes/coursesRoute");
const authRouter = require("./routes/authRoute");

const app = express();

// Body Parser
app.use(express.json());

// Dev logging middleware
if (process.env.Node_Env === "development") {
  app.use(morgan);
}

//File upload
app.use(fileupload());

//Cookie parser
app.use(cookieParser());
//Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount routers
app.use("/api/v1/bootcamps", bootcampsRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/auth", authRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT);

//Handle unhandled rejections
process.on("unhandledRejection", (err, promise) => {
  console.log("error", err.message);

  // Close server and exit process
  server.close(() => process.exit(1));
});
