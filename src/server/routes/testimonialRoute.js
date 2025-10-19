const {
  CreateTestimonial,
  AllTestimonial,
  GetOneTestimonial,
  EditTestimonial,
  DeleteTestimonial,
} = require("../controller/testimonialController");
const { authenticateUser } = require("../middlewares/authorizations");

const router = require("express").Router();

router.post("/create", authenticateUser, CreateTestimonial);
router.get("/all", AllTestimonial);
router.get("/getOne/:id", GetOneTestimonial);
router.put("/edit/:id", EditTestimonial);
router.delete("/delete/:id", DeleteTestimonial);

module.exports = router;
