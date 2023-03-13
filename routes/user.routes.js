const express = require("express");
const auth = require("../middleware/auth");
const {
    registerUser,
    getAll,
    loginUser,
    getById,
    updateUser
} = require("../controllers/user.controller");

const router = express.Router();

 router.get("/people", getAll);

 router.get("/user/:id", auth, getById);

router.post("/register", registerUser);

router.post("/login", loginUser);

 router.put("/user/:id", auth, updateUser);

// router.delete("/people/:id", deletePeople);

module.exports = router;