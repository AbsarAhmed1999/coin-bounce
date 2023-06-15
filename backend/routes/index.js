const epxress = require("express");
const authController = require("../controller/authController");
const blogController = require("../controller/blogController");
const commentController = require("../controller/commentController");
const auth = require("../middleware/auth");
const router = epxress.Router();
//testing
// user

//register
router.post("/register", authController.register);
//login
router.post("/login", authController.login);

//logout
router.post("/logout", auth, authController.logout);

//refresh
router.get("/refresh", authController.refresh);

//blogs
//Create
router.post("/blog", auth, blogController.create);
//get all blogs
router.get("/blog/all", auth, blogController.getAll);

//get blog by id
router.get("/blog/:id", auth, blogController.getById);

//Update
router.put("/blog", auth, blogController.update);
//delete
router.delete("/blog/:id", auth, blogController.delete);

//comment
//create comment
router.post("/comment", auth, commentController.create);
//get comments by blog id
router.get("/comment/:id", auth, commentController.getById);

module.exports = router;
