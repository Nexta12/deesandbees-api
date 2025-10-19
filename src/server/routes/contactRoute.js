const {
  CreateContact,
  AllContact,
  GetOneContact,
  EditContact,
  DeleteContact,
} = require("../controller/ContactController");

const router = require("express").Router();

router.post("/create", CreateContact);
router.get("/all", AllContact);
router.get("/getOne/:id", GetOneContact);
router.put("/edit/:id", EditContact);
router.delete("/delete/:id", DeleteContact);

module.exports = router;
