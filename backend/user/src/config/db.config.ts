import mongoose from "mongoose";
import dotenv  from "dotenv"

dotenv.config()

export const dbConnect = async() => {
    
    const mongoUri = process.env.MONOGO_URI || "mongodb://127.0.0.1:27017/";
    
    try{
        await mongoose.connect(mongoUri,{
            dbName: "ChatApp"
        });

        console.log("Connected to MonogoDB");
    }
    catch(error){
        console.log("Failed to connect to MonogDB",error);
        process.exit(1);
    }
}