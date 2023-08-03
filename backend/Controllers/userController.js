import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import { genToken } from "../utils/genToke.js";

// authenticate user
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  // check for the user, mongoose method
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    genToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  console.log(req.body);
});

// register user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  // check user
  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error("User already exists");
  }
  // create a user
  const user = await User.create({
    name,
    email,
    password,
  });
  //   if user is created and in the database
  if (user) {
    genToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      email: user.email,
      name: user.name,
      isAdmin: false,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// logout user
const logoutUser = asyncHandler(async (req, res) => {
  // clear the cookie
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({
    message: "Logout successfully",
  });
});

// get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  // Get the id of the user that is currently logged in
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// update user profile
const updateUserProfile = asyncHandler(async (req, res) => {

  const user = await User.findById(req.user._id);
  if(user) {
    // update only the name property of the user
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if(req.body.password){
      user.password = req.body.password;
    }

    // save the updated user to the database
    const updatedUser = await user.save();
    console.log(updateUser);
    res.status(200).json({
      _id: updatedUser._id,
      email: updatedUser.email,
      name: updatedUser.name,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

// Admin user

// Admin get users
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.status(200).json(users);
});

// Admin get user by id
const getUsersById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if(user) {
    res.status(200).json(user);
  } else {
    res.status(400)
    throw new Error("User not found")
  }
});

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if(user) {
    if(user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin user");
    } else {
      await User.deleteOne({_id:user._id});
      res.status(201).json({
        message: "User deleted successfully"
      });
    } 
  } else {
      res.status(400);
      throw new Error("User not found");
  }
});

// update user
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if(user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  updateUser,
  getUsers,
  getUsersById,
  deleteUser,
};
