import { publishToQueue } from "../config/rabbitmq.config.js";
import TryCatch from "../config/TryCatch.js";
import { redisClient } from "../utils/redis.utils.js";


export const loginUser = TryCatch( async(req,res)=>{
    const {email} = req.body;

    // rate-limit
    const rateLimitKey = `otp:ratelimit:${email}`;
    const rateLimit = await redisClient.get(rateLimitKey);

    if(rateLimit){
        res.status(429).json({
            message:"too many request , Please wait before requesting new otp",
        })
        return;
    }

    const otp = Math.floor(100000 + Math.random()*900000).toString(); // 6 digit otp
    const otpKey = `otp:${email}`;
    
    await redisClient.set(otpKey,otp, {
        EX:300, // 300 milli seconds
    });

    await redisClient.set(rateLimitKey,"true",{
        EX:60,
    });

    const message = {
        to: email,
        subject: "Your otp code",
        body: `Your OTP is ${otp}. It is valid for 5 minutes`,
    };

    await publishToQueue("send-otp",message);
    res.status(200).json({
        success:true,
        message: "OTP send to your mail"
    });
    

})