import { Router } from "express";
import * as ctrl from "../controllers/authController.js"

const router = Router();

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.get("/myprofile", ctrl.myProfile);
router.get("/logout", ctrl.logout);
router.post("/update", ctrl.updateProfile);

export default router;