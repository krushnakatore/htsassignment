import express from "express";
import {
  signinController,
  signupController,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/sign-up", signupController);
router.post("/sign-in", signinController);

export default router;
