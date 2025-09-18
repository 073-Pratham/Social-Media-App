import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRotes from "./routes/auth.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRotes);


const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`Server is running at PORT ${PORT}`);
})

