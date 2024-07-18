import express from "express";
import dotenv from "dotenv";
import connectDB from "./DB/connection.js";
import allRouters from "./routes.js";
const app = express();
dotenv.config();
app.use(express.json())
connectDB()

const port = process.env.PORT;
allRouters(app)

app.use("*", (req, res, next) => {
    return next(new Error("Url not found", { cause: 404 }));
  });
  
  // &Global error handler
  app.use((error, req, res, next) => {
    const statusCode = error.cause || 500;
    return res.status(statusCode).json({
      message: false,
      error: error.message,
      stack: error.stack,
    });
  });

  
app.listen(port, () => console.log(`Task app listening on port ${port}!`));
