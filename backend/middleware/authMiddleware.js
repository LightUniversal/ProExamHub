import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

// Protect Routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Read the JWT from the cookie
  token = req.cookies.jwt;
  if (token) {
    // decode the token to get the userid
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;
      // docoded is an object (payload) with the user id
      req.user = await User.findById(userId).select("-password");
      next();
    } catch (error) {
      console.log(error);
        res.status(401);
        throw new Error("Not authorized, token failed")
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// Admin Middleware
const admin = (req, res, next) => {
    if(req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error("Not authorized an admin");
    }
};

export { protect, admin};