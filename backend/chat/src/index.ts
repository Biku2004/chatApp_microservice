import express from "express"
import dotenv from "dotenv";
import { dbConnect } from "./config/db.config.js";
import chatRoutes from "./routes/chat.route.js"

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5002;

dbConnect();

app.use("/api/v1",chatRoutes);

app.listen(PORT,()=>{
    console.log(`Connected to PORT : ${PORT}`);
})
