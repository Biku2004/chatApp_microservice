import express from "express"
import dotenv from "dotenv"
import { startSendOtpToConsumer } from "./consumer.js";

dotenv.config();

startSendOtpToConsumer();

const app = express();

const PORT = process.env.PORT || 5001;

app.listen(PORT, ()=>{
    console.log(`Server is running on PORT ${PORT}`);
});