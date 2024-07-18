import express from "express";
const router = express.Router();
import { check } from "express-validator";
import { getCurrentUser, registerUser } from "../controller/users";
import verifyToken from "../middleware/auth";

// api/users/register
router.post(
  "/register",
  [
    check("name", "Name is required").isString(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
    check("username", "Username is required").isString(),
    check("state", "State is required").isString(),
  ],
  registerUser
);

router.get("/me", verifyToken, getCurrentUser);

export default router;
