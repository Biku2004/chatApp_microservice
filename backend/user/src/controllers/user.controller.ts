import { generateToken } from "../config/generateToken.js";
import { publishToQueue } from "../config/rabbitmq.config.js";
import TryCatch from "../config/TryCatch.js";
import { AuthenticatedRequest } from "../middlewares/isauth.middleware.js";
import { User } from "../models/User.js";
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
    

});

export const verifyUser = TryCatch(async(req,res)=>{
    const {email, otp:enteredOtp} = req.body;

    if(!email || !enteredOtp){
        res.status(400).json({
            message: "Email and OTP required",
        });
        return;
    }

    // getting the otp key from redis
    const otpKey = `otp:${email}`;
    
    const storedOtp = await redisClient.get(otpKey);

    if(!storedOtp || storedOtp!== enteredOtp){
        res.status(400).json({
            success:false,
            message: "Invalid or expired OTP"
        });
        return;
    }

    await redisClient.del(otpKey);

    let user = await User.findOne({email});
    if(!user){
        const name = email.slice(0,8);
        user = await User.create({name,email});
    }

    const token = generateToken(user);
    res.json({
        message:"User verified",
        user,
        token
    });

});

export const myProfile = TryCatch(async(req:AuthenticatedRequest,res) =>{
    const user = req.user;

    res.json(user);
});

export const updateName = TryCatch(async(req:AuthenticatedRequest,res)=>{
    const user = await User.findById(req.user?._id);

    if(!user){
        res.status(404).json({
            message:"Please login",
        });
        return;
    }

    user.name = req.body.name;

    await user.save();

    const token = generateToken(user);
    res.json({
        message:"User name updated",
        user,
        token,
    });

});

export const getAllUsers = TryCatch(async(req:AuthenticatedRequest,res)=>{
    const user = await User.find();

    res.json(user);
});

export const getAUser = TryCatch(async(req,res)=>{
    const user = await  User.findById(req.params.id);
    res.json(user);
})