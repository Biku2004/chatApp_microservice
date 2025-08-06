import express from "express";
import dotenv  from "dotenv"
import { dbConnect } from "./config/db.config.js";
import { redisClient } from "./utils/redis.utils.js";
import userRoutes from "./routes/user.routes.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

dbConnect();

redisClient.connect()
    .then( ()=>{
        console.log("Connected to redis successfully")
    })
    .catch((err)=>{
        console.log("Error while connecting to redis",err)
    });

app.use("/api/v1",userRoutes);


app.listen(PORT,()=>{
    console.log(`Server Started on PORT ${PORT}`);
});

