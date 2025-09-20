import { Router } from "express";
import * as ctrl from "../controllers/authController.js";
import { rateLimiterMiddleware } from "../middleware/auth.js";

const router = Router();

router.post("/register", rateLimiterMiddleware, ctrl.register);
router.post("/verify-otp", ctrl.verifyOtp);
router.post("/login", ctrl.login);
router.get("/myprofile", ctrl.myProfile);
router.get("/logout", ctrl.logout);
router.post("/update", ctrl.updateProfile);

export default router;