import express from "express"
import { getAllUsers, getAUser, loginUser, myProfile, updateName, verifyUser } from "../controllers/user.controller.js";
import { isAuth } from "../middlewares/isauth.middleware.js";

const router = express.Router();

router.post("/login",loginUser);
router.post("/verify",verifyUser);
router.get("/me",isAuth,myProfile);
router.post("/update/user",isAuth,updateName);
router.get("/user/all",isAuth,getAllUsers);
router.get("/user/:id",getAUser);


export default router;