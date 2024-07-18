import express from "express";
import { check } from "express-validator";
import { login, logout, validateToken } from "../controller/users";
import verifyToken from "../middleware/auth";
const router = express.Router();
router.post(
  "/login",
  [
    check("username", "Username is required").isString(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
  login
);

router.get("/validate-token", verifyToken, validateToken);

router.post("/logout", logout);

export default router;
