require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
// db
const connectDB = require("./db/connect");
// routers
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// auth middleware
const auth = require("./middleware/authentication");

// security packages
const helmet = require("helmet");
const cors = require("cors");
// for xss there is no package
const rateLimiter = require("express-rate-limit");

app.set("trust proxy", 1);
app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json());
app.use(helmet());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Jobs api");
});

// routes
app.use("/api/v1/auth", authRouter);
// for routes that need auth to get access to we add the auth middleware before those routes
app.use(notFoundMiddleware);

app.use(auth);
app.use("/api/v1/jobs", jobsRouter);

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
