import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.js";

const app = express();
dotenv.config();

(async () => await connectDB())();

//middleware
app.use(cors());
app.use(express.json());

//routes

app.use("/api/v1/user", userRoutes);

app.get("/", (req, res) => {
  res.send({
    msg: "Welcome and Please open postman to play the url",
  });
});

//port
const PORT = process.env.PORT || 9000;

app.listen(PORT, (req, res) => {
  console.log("listening on port", PORT);
});
