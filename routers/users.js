const router = require("express").Router();
const control = require("../controllers/userController");
const validate = require("../middlewares/validator");

router.post("/", validate.validateRegister, control.createData);
router.get("/all", control.getAllUser);
router.put("/update/:idUser", validate.updateUser, control.updateUser);
router.delete("/delete/:idUser", control.deleteUser);

module.exports = router;