const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// LOAD env vars
dotenv.config({ path: "./config/config.env" });

//Connect to DB
connectDB();

// Route files
const route = require("./routes/bootcampRoute");

const app = express();

// Body Parser
app.use(express.json());

// Dev logging middleware
if (process.env.Node_Env === "development") {
  app.use(morgan);
}
// Mount routers
app.use("/api/v1/bootcamps", route);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT);

//Handle unhandled rejections
process.on("unhandledRejection", (err, promise) => {
  console.log("error", err.message);

  // Close server and exit process
  server.close(() => process.exit(1));
});
