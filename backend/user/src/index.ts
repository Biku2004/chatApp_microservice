import express from "express";
import dotenv  from "dotenv"
import { dbConnect } from "./config/db.config.js";
import { redisClient } from "./utils/redis.utils.js";
import userRoutes from "./routes/user.routes.js"
import { connectRabbitMQ } from "./config/rabbitmq.config.js";

dotenv.config();

const app = express();
app.use(express.json());

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

await connectRabbitMQ();


app.listen(PORT,()=>{
    console.log(`Server Started on PORT ${PORT}`);
});

