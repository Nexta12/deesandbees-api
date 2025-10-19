const { CreateUser, EditUser, DeleteUser, AllUsers } = require('../controller/userController');
const { authenticateUser } = require('../middlewares/authorizations');

const router = require('express').Router();

router.post("/create", authenticateUser, CreateUser);
router.get("/all", AllUsers);
router.put("/edit/:id", authenticateUser, EditUser)
router.delete("/delete/:id", authenticateUser, DeleteUser)

module.exports = router;

