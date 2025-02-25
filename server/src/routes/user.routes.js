const { Router } = require("express");
const userController = require("../controllers/users.controller");
const router = Router();
// const verifyJWT = require("../middlewares/auth.middleware");

// // login user
// router.route("/loginUser").post(userController.loginUser);
// router.route("/changePassword").post(userController.changePassword);
// // refresh token
// router.route("/refresh-token").post(userController.refreshAccessToken);

// register user
router.route("/createNewUser").post(userController.registerUser);

// // logout user
// router.post("/logout", verifyJWT, userController.logoutUser);

// // fetching user details
// router.route("/userDetails").post(userController.userDetails);
// router.route("/currentUser").get(verifyJWT, userController.currentUser);
// // creating new user
// router.route("/createUser").post(userController.createNewUser);
// //assigning client to user
// router.route("/assignClient").post(userController.assignClient);
// router.post("/sendOTP").post(userController.sendOtp);
// router.post("/changePassword").post(userController.changePassword);

module.exports = router;
